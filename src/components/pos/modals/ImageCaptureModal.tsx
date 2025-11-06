import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Trash2 } from 'lucide-react';

// Interface remains the same
interface ImageCaptureModalProps {
    onClose: () => void;
    onCapture: (images: string[]) => void;
    onSkip: () => void;
}

export default function ImageCaptureModal({
    onClose,
    onCapture,
    onSkip,
}: ImageCaptureModalProps) {
    const [capturedImages, setCapturedImages] = useState<string[]>([]);
    
    // State for the video stream and any errors
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Refs for the video and canvas elements
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Function to start the camera stream
    const startCamera = async () => {
        try {
            // Request video stream
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }, // Prefer rear camera
            });
            setStream(stream);
            if (videoRef.current) {
                // Attach the stream to the video element
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera: ", err);
            // Handle common errors
            if (err instanceof DOMException) {
                if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                    setError('Camera access was denied. Please allow camera permissions in your browser settings.');
                } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                     setError('No camera found. Please ensure a camera is connected and enabled.');
                } else {
                     setError('An error occurred while accessing the camera.');
                }
            } else {
                setError('An unknown error occurred while accessing the camera.');
            }
        }
    };

    // Function to stop the camera stream
    const stopStream = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop()); // Stop all tracks
            setStream(null);
        }
    };

    // Start camera on mount, stop on unmount
    useEffect(() => {
        startCamera();

        // Cleanup function: stop the stream when component unmounts
        return () => {
            stopStream();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array means this runs once on mount

    // Replaced the simulated capture with a real one
    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            // Set canvas dimensions to match the video feed
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw the current video frame onto the canvas
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // Get the image as a base64 data URL
                const base64Image = canvas.toDataURL('image/png');
                
                // Add the new image to the list
                setCapturedImages((prevImages) => [...prevImages, base64Image]);
            }
        }
    };

    const handleDeleteImage = (index: number) => {
        setCapturedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    // Modified handlers to also stop the stream
    const handleDoneCapturing = () => {
        stopStream();
        onCapture(capturedImages);
    };

    const handleClose = () => {
        stopStream();
        onClose();
    };

    const handleSkip = () => {
        stopStream();
        onSkip();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[90vh]">
                {/* Header */}
                <header className="flex items-center justify-between p-4 border-b bg-blue-50">
                    <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                        <Camera className="w-6 h-6" /> Capture Item Image ({capturedImages.length} Captured)
                    </h2>
                    <button
                        onClick={handleClose} // Use modified handler
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full bg-white transition duration-150"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </header>

                {/* Main Content Area */}
                <div className="p-6 flex flex-col gap-6 overflow-y-auto flex-1">
                    {/* Camera View Area */}
                    <div className="flex flex-col items-center justify-center bg-gray-100 relative p-4 border rounded-lg">
                        {error ? (
                            // Display error if camera access failed
                            <div className="w-full h-64 bg-red-100 rounded-lg flex items-center justify-center text-center text-red-700 font-semibold p-4">
                                {error}
                            </div>
                        ) : (
                            // Display live video feed
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted // Mute to avoid audio feedback
                                className="w-full h-64 bg-gray-300 rounded-lg border-4 border-gray-400 object-cover"
                            >
                                [Live camera feed]
                            </video>
                        )}
                         {/* Hidden canvas for capturing snapshots */}
                        <canvas ref={canvasRef} style={{ display: 'none' }} />

                        {!error && (
                             <p className="mt-3 text-sm italic text-gray-500">
                                Click "Capture Image" to take a photo.
                            </p>
                        )}
                    </div>

                    {/* Captured Images Preview */}
                    {capturedImages.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-gray-700">Captured Images:</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {capturedImages.map((image, index) => (
                                    <div key={index} className="relative group border rounded-lg overflow-hidden shadow-sm">
                                        <img
                                            src={image}
                                            alt={`Captured ${index + 1}`}
                                            className="w-full h-24 object-cover"
                                        />
                                        <button
                                            onClick={() => handleDeleteImage(index)}
                                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition duration-200"
                                            title="Remove Image"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <p className="text-xs text-center p-1 bg-gray-50">Image {index + 1}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <footer className="p-4 border-t flex justify-between items-center bg-white">
                    <button
                        onClick={handleSkip} // Use modified handler
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-150"
                    >
                        Skip & Add Job
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={handleCapture} // Use real capture handler
                            disabled={!stream || !!error} // Disable if no stream or if there's an error
                            className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md flex items-center gap-2 transition duration-150 ${
                                (!stream || !!error) ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            <Camera className="w-5 h-5" /> Capture Image
                        </button>
                        <button
                            onClick={handleDoneCapturing} // Use modified handler
                            disabled={capturedImages.length === 0}
                            className={`font-bold py-2 px-6 rounded-lg shadow-md transition duration-150 ${
                                capturedImages.length > 0
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            }`}
                        >
                            Done ({capturedImages.length})
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
}