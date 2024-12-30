import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSocket } from "../contexts/SocketContexts";

interface VideoCallProps {
  roomId: string;
  usertype: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ roomId, usertype }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const negotiationPendingRef = useRef(false);
  const socket = useSocket();

  useEffect(() => {
    let hasJoined = false;

    // Get user media (camera and microphone)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log("Media stream acquired:", stream);
        setLocalStream(stream);
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });

    // Join the room
    if (!hasJoined && socket) {
      console.log(`Joining room: ${roomId}`);
      socket.emit("join", roomId);
      hasJoined = true;
    }

    // Listen for signaling data
    socket?.on("signal", async (data) => {
      console.log("Received signaling data:", JSON.stringify(data, null, 2));
      if (data.caller !== socket.id) {
        await handleSignal(data);
      }
    });

    // Listen for user connected event
    socket?.on("user-connected", () => {
      console.log("User connected, initiating call");
      callUser();
    });

    // Cleanup on component unmount
    return () => {
      console.log("Cleaning up resources");

      localStream?.getTracks().forEach((track) => track.stop());

      peerConnectionRef.current?.close();
      peerConnectionRef.current = null;

      socket?.off("signal");
      socket?.off("user-connected");
    };
  }, [roomId, socket]);

  // Attach stream to video elements
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const callUser = useCallback(() => {
    if (negotiationPendingRef.current) return; // Avoid multiple offers
    console.log("Calling user");

    const peerConnection = createPeerConnection();
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });
    }

    peerConnectionRef.current = peerConnection;

    peerConnection
      .createOffer()
      .then((offer) => {
        console.log("Created offer:", offer);
        negotiationPendingRef.current = true;
        return peerConnection.setLocalDescription(offer);
      })
      .then(() => {
        console.log("Sending offer");
        socket?.emit("signal", {
          type: "offer",
          offer: peerConnectionRef.current?.localDescription,
          roomId,
          caller: socket.id,
        });
      })
      .catch((error) => {
        console.error("Error creating or sending offer:", error);
        negotiationPendingRef.current = false;
      });
  }, [localStream, roomId, socket]);

  const handleSignal = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (data: any) => {
      const peerConnection =
        peerConnectionRef.current || createPeerConnection();
      peerConnectionRef.current = peerConnection;

      try {
        if (data.type === "offer") {
          if (!data.offer || !data.offer.type || !data.offer.sdp) {
            console.error("Invalid offer received:", data.offer);
            return;
          }

          if (peerConnection.signalingState !== "stable") {
            console.warn(
              "Cannot handle offer in signaling state:",
              peerConnection.signalingState
            );
            return;
          }

          console.log("Received offer:", data.offer);
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(data.offer)
          );

          if (localStream) {
            localStream.getTracks().forEach((track) => {
              peerConnection.addTrack(track, localStream);
            });
          }

          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);

          console.log("Sending answer");
          socket?.emit("signal", {
            type: "answer",
            answer: peerConnection.localDescription,
            roomId,
            caller: socket.id,
          });
        } else if (data.type === "answer") {
          if (!data.answer || !data.answer.type || !data.answer.sdp) {
            console.error("Invalid answer received:", data.answer);
            return;
          }

          if (peerConnection.signalingState !== "have-local-offer") {
            console.warn(
              "Cannot handle answer in signaling state:",
              peerConnection.signalingState
            );
            return;
          }

          console.log("Received answer:", data.answer);
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(data.answer)
          );
          negotiationPendingRef.current = false;
        } else if (data.candidate) {
          console.log("Received ICE candidate:", data.candidate);
          await peerConnection.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
        }
      } catch (error) {
        console.error("Error handling signaling data:", error);
      }
    },
    [localStream, roomId, socket]
  );

  const createPeerConnection = useCallback(() => {
    console.log("Creating peer connection");
    const peerConnection = new RTCPeerConnection();

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate:", event.candidate);
        socket?.emit("signal", {
          type: "candidate",
          candidate: event.candidate,
          roomId,
          caller: socket.id,
        });
      }
    };

    // Handle receiving remote tracks
    peerConnection.ontrack = (event) => {
      if (event.streams[0]) {
        console.log("Received remote stream:", event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      }
    };

    peerConnection.onconnectionstatechange = () => {
      console.log("Connection state changed:", peerConnection.connectionState);
      if (peerConnection.connectionState === "failed") {
        console.error("Connection failed");
      }
    };

    return peerConnection;
  }, [roomId, socket]);

  const toggleAudio = useCallback(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
  }, [localStream]);

  // const toggleVideo = useCallback(() => {
  //   if (localStream) {
  //     localStream.getVideoTracks().forEach((track) => {
  //       track.enabled = !track.enabled);
  //     });
  //   }
  // }, [localStream]);

  return (
    <div className="flex flex-col items-center justify-center h-[60%] bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-lg shadow-lg">
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            ref={localVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
          />
          <div className="absolute bottom-2 left-2 p-2 bg-black bg-opacity-50 text-white rounded-lg">
            You
          </div>
        </div>
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            ref={remoteVideoRef}
            className="w-full h-full object-cover"
            autoPlay
          />
          <div className="absolute bottom-2 left-2 p-2 bg-black bg-opacity-50 text-white rounded-lg">
            {usertype === "doctor" ? "Patient" : "Doctor"}
          </div>
        </div>
      </div>
      <div className="mt-4 flex space-x-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
          onClick={toggleAudio}
        >
          Toggle Audio
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
          // onClick={toggleVideo}
        >
          Toggle Video
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
