import { Camera, X } from 'lucide-react';

interface ImageCaptureModalProps {
    onClose: () => void;
    onCapture: (image: string) => void;
    onSkip: () => void;
}

export default function ImageCaptureModal({
    onClose,
    onCapture,
    onSkip,
}: ImageCaptureModalProps) {
    const handleSimulatedCapture = () => {
        // Placeholder base64 image (mock camera capture)
        const base64Image =
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/yN/DAAAACXBIWXMAAAsTAAALEwEAmpwYAAABsklEQVR4nO3dO04DQRQF0W8BMSkRCRo2eW4NBE8ABU4JqIAG9Y1bW2kCg0lGggQx4o02N8l2932tY3s/kL8c5v/rM9p6U277qYyS3/h9P5+B+Q91EJEKx1c+v4/f+fA2pU97qYyS3/h9f9+n/w4iEalQLO2u7u40pU/5qYyS3/h9f/t3t4B1yP1UJs98D0RCHfP087z127f8lJ/K2X7uJt+35aegUuqY77/7dF3fA/OQn8rZfu4m37elHwKRiEal3b09w8/z8NOn/FTO9nM3/b4t/RCIhGpR/vnnr/7x8/Xz/v3e29qX7+f5uJt9/Sj/c/38Pj9D+Y+X/dZNv2/L70BEIhG1Qj66+vj6q/D28/1dG9jR1X/+X4H46O3jV97t3fF7kH/NT+Vsv3cTbtsuD8xPZe9f/vP310fXb/t3fD/T/O1v/m5j/b6tPzL7x97x1u/33n3c/f3O/f3P/fve29qX7+f5uJt9/Sj/c/38Pj/3/Gf+b2f6v52/5af8Vs72czf9vu1/RCIhGoRiUSiFpFIJCIWiUQikYhYJCKRSCQikkSif0lE3y4l4VwVAAAAAElFTkSuQmCC';
        onCapture(base64Image);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between p-4 border-b bg-blue-50">
                    <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                        <Camera className="w-6 h-6" /> Capture Item Image
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full bg-white transition duration-150"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </header>

                {/* Camera Simulation Area */}
                <div className="p-6 flex flex-col items-center justify-center bg-gray-100 flex-1 relative">
                    <div className="w-full h-64 bg-gray-300 rounded-lg border-4 border-gray-400 flex items-center justify-center text-center text-gray-600 font-semibold text-lg">
                        [LIVE CAMERA FEED SIMULATION AREA]
                    </div>
                    <p className="mt-3 text-sm italic text-gray-500">
                        (Using a placeholder image on "Capture")
                    </p>
                </div>

                {/* Footer Actions */}
                <footer className="p-4 border-t flex justify-between bg-white">
                    <button
                        onClick={onSkip}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg shadow-md"
                    >
                        Skip & Add Job
                    </button>
                    <button
                        onClick={handleSimulatedCapture}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md flex items-center gap-2"
                    >
                        <Camera className="w-5 h-5" /> Capture Image
                    </button>
                </footer>
            </div>
        </div>
    );
}