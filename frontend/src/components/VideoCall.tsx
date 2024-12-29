// VideoCall.tsx
import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../contexts/SocketContexts";

interface VideoCallProps {
  roomId: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ roomId }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const socket = useSocket();

  useEffect(() => {
    // Get user media (camera and microphone)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log("Media stream acquired:", stream);
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });

    // Join the room
    socket?.emit("join-room", roomId);

    // Listen for signaling data
    socket?.on("signal", async (data) => {
      console.log("Received signaling data:", data);
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
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }

      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }

      socket?.disconnect();
    };
  }, [roomId]);

  // Function to create peer connection and initiate the call
  const callUser = () => {
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
        return peerConnection.setLocalDescription(offer);
      })
      .then(() => {
        console.log("Sending offer");
        socket?.emit("signal", {
          type: "offer",
          offer: peerConnection.localDescription,
          roomId,
          caller: socket.id,
        });
      });
  };

  // Handle signaling data (offer, answer, candidate)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSignal = async (data: any) => {
    const peerConnection = createPeerConnection();
    peerConnectionRef.current = peerConnection;

    if (data.type === "offer") {
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

      socket?.emit("signal", {
        type: "answer",
        answer: peerConnection.localDescription,
        roomId,
        caller: socket.id,
      });
    } else if (data.type === "answer") {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
    } else if (data.candidate) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  };

  // Create and configure the RTC peer connection
  const createPeerConnection = () => {
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
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      }
    };

    return peerConnection;
  };

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted />
      <video ref={remoteVideoRef} autoPlay />
    </div>
  );
};

export default VideoCall;
