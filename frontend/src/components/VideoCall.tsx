import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSocket } from "../contexts/SocketContexts";
import { IoVolumeMute } from "react-icons/io5";
import { IoMdCall } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import VideoCallModal from "./VideoCallModal";
import sound from "../assets/sound/chime_ding.mp3";

interface VideoCallProps {
  roomId: string;
  usertype: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ roomId, usertype }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [message, setMessage] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const negotiationPendingRef = useRef(false);
  const socket = useSocket();
  const navigate = useNavigate();

  const play = () => {
    new Audio(sound).play();
  };

  useEffect(() => {
    const initLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
      } catch (error) {
        console.error(error);
      }
    };

    initLocalStream();
    socket?.emit("join", roomId);

    socket?.on("signal", handleSignal);

    return cleanupResources;
  }, [roomId, socket]);

  useEffect(() => {
    if (socket) {
      socket?.on("call-started", () => {
        if (!isJoined) {
          if (usertype === "patient") {
            setIsCallStarted(true);
            setMessage(false);
            play();
          }
        } else {
          setIsCallStarted(false);
        }
      });
    }
  }, [socket, isJoined]);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const cleanupResources = useCallback(() => {
    localStream?.getTracks().forEach((track) => track.stop());
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    socket?.off("signal", handleSignal);
  }, [localStream, socket]);

  const createPeerConnection = useCallback(() => {
    const peerConnection = new RTCPeerConnection();

    peerConnection.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socket?.emit("signal", {
          type: "candidate",
          candidate,
          roomId,
          caller: socket.id,
        });
      }
    };

    peerConnection.ontrack = ({ streams }) => {
      if (streams[0]) {
        setRemoteStream(streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = streams[0];
        }
      }
    };

    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === "failed") {
        console.error("Connection failed");
      }
    };

    return peerConnection;
  }, [roomId, socket]);

  const callUser = useCallback(async () => {
    if (negotiationPendingRef.current) return;

    const peerConnection = createPeerConnection();

    localStream?.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnectionRef.current = peerConnection;

    try {
      const offer = await peerConnection.createOffer();
      negotiationPendingRef.current = true;
      await peerConnection.setLocalDescription(offer);

      socket?.emit("signal", {
        type: "offer",
        offer,
        roomId,
        caller: socket.id,
      });

      socket?.emit("call-started", { roomId });
    } catch (error) {
      console.error(error);
      negotiationPendingRef.current = false;
    }
  }, [localStream, roomId, socket, createPeerConnection]);

  const handleSignal = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (data: any) => {
      const peerConnection =
        peerConnectionRef.current || createPeerConnection();
      peerConnectionRef.current = peerConnection;

      try {
        if (data.type === "offer") {
          await handleOffer(peerConnection, data.offer);
        } else if (data.type === "answer") {
          await handleAnswer(peerConnection, data.answer);
        } else if (data.candidate) {
          await peerConnection.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
        }
      } catch (error) {
        console.error(error);
      }
    },
    [createPeerConnection]
  );

  const handleOffer = async (
    peerConnection: RTCPeerConnection,
    offer: RTCSessionDescriptionInit
  ) => {
    if (!offer || peerConnection.signalingState !== "stable") {
      return;
    }

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    localStream?.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket?.emit("signal", {
      type: "answer",
      answer,
      roomId,
      caller: socket.id,
    });
  };

  const handleAnswer = async (
    peerConnection: RTCPeerConnection,
    answer: RTCSessionDescriptionInit
  ) => {
    if (!answer || peerConnection.signalingState !== "have-local-offer") {
      return;
    }

    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
    negotiationPendingRef.current = false;
  };

  const toggleAudio = useCallback(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
        setAudioEnabled(track.enabled);
      });
    }
  }, [localStream]);

  const endCall = useCallback(() => {
    cleanupResources();

    if (usertype === "doctor") {
      changeAppointmentStatus();
      navigate("/doctor/medicalform", { state: { roomId } });
    } else {
      navigate("/appointments");
    }
  }, [cleanupResources, usertype, navigate, roomId]);

  const changeAppointmentStatus = useCallback(async () => {
    try {
      const response = await api.put(`/appointments/${roomId}`);
      if (response.data.success) {
        console.log("updated");
      }
    } catch (error) {
      console.error(error);
    }
  }, [roomId]);

  return (
    <>
      <div className="flex flex-col items-center justify-center h-[60%] px-2">
        <strong>Consultation Room</strong>
        {usertype === "patient" && message && (
          <div className="h-8 bg-yellow-300 p-1">
            <p>Wait for doctor to start the call</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-lg shadow-sm">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
            />
            <div className="absolute bottom-2 left-2 p-2 bg-black bg-opacity-50 text-white rounded-lg">
              You {audioEnabled ? "Unmuted" : "Muted"}
            </div>
          </div>
          <div className="relative bg-black rounded-lg overflow-hidden">
            {!remoteStream && (
              <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                Waiting for {usertype === "doctor" ? "Patient" : "Doctor"} to
                join...
              </div>
            )}
            <video
              ref={remoteVideoRef}
              className="w-full h-full object-cover"
              autoPlay
            />
          </div>
        </div>
        <div className="mt-4 flex space-x-4">
          {usertype === "doctor" && (
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              onClick={callUser}
            >
              <IoMdCall />
            </button>
          )}
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={toggleAudio}
          >
            <IoVolumeMute />
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={endCall}
          >
            <IoMdCall />
          </button>
        </div>
      </div>
      <VideoCallModal
        showModal={isCallStarted}
        onClose={() => setIsCallStarted(false)}
        onConfirm={() => {
          setIsJoined(true);
          if (callUser) callUser();
          setIsCallStarted(false);
        }}
      />
    </>
  );
};

export default VideoCall;
