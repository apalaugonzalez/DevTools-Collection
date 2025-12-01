"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    Home as HomeIcon,
    ChevronRight,
    Smartphone,
    Tablet,
    Monitor,
    RotateCw,
    RefreshCw,
    Search,
    X,
    AlertCircle,
    Settings,
    Plus,
    Trash2,
} from "lucide-react";

// --- Type Definitions ---

interface DevicePreset {
    id: string;
    name: string;
    category: "mobile" | "tablet" | "laptop";
    manufacturer?: string;
    width: number;
    height: number;
}

type Orientation = "portrait" | "landscape";

interface DeviceSlot {
    device: DevicePreset | null;
    orientation: Orientation;
    url: string;
    isLoading: boolean;
    error: string | null;
    iframeKey: number;
}

// --- Device Presets Data (same as before) ---

const IPHONE_DEVICES: DevicePreset[] = [
    { id: "iphone-4", name: "iPhone 4", category: "mobile", manufacturer: "Apple", width: 320, height: 480 },
    { id: "iphone-5", name: "iPhone 5/5E", category: "mobile", manufacturer: "Apple", width: 320, height: 568 },
    { id: "iphone-se", name: "iPhone SE", category: "mobile", manufacturer: "Apple", width: 375, height: 667 },
    { id: "iphone-6-7-8", name: "iPhone 6/7/8", category: "mobile", manufacturer: "Apple", width: 375, height: 667 },
    { id: "iphone-6-7-8-plus", name: "iPhone 6/7/8 Plus", category: "mobile", manufacturer: "Apple", width: 414, height: 736 },
    { id: "iphone-x", name: "iPhone X", category: "mobile", manufacturer: "Apple", width: 375, height: 812 },
    { id: "iphone-xr", name: "iPhone XR", category: "mobile", manufacturer: "Apple", width: 414, height: 896 },
    { id: "iphone-12-pro", name: "iPhone 12 Pro", category: "mobile", manufacturer: "Apple", width: 390, height: 844 },
    { id: "iphone-13-pro-max", name: "iPhone 13 Pro Max", category: "mobile", manufacturer: "Apple", width: 428, height: 926 },
    { id: "iphone-14", name: "iPhone 14", category: "mobile", manufacturer: "Apple", width: 390, height: 844 },
    { id: "iphone-14-plus", name: "iPhone 14 Plus", category: "mobile", manufacturer: "Apple", width: 428, height: 926 },
    { id: "iphone-14-pro", name: "iPhone 14 Pro", category: "mobile", manufacturer: "Apple", width: 393, height: 852 },
    { id: "iphone-14-pro-max", name: "iPhone 14 Pro Max", category: "mobile", manufacturer: "Apple", width: 430, height: 932 },
    { id: "iphone-15", name: "iPhone 15", category: "mobile", manufacturer: "Apple", width: 393, height: 852 },
    { id: "iphone-15-plus", name: "iPhone 15 Plus", category: "mobile", manufacturer: "Apple", width: 430, height: 932 },
    { id: "iphone-15-pro", name: "iPhone 15 Pro", category: "mobile", manufacturer: "Apple", width: 393, height: 852 },
    { id: "iphone-16", name: "iPhone 16", category: "mobile", manufacturer: "Apple", width: 393, height: 852 },
    { id: "iphone-16-plus", name: "iPhone 16 Plus", category: "mobile", manufacturer: "Apple", width: 430, height: 932 },
    { id: "iphone-16-pro", name: "iPhone 16 Pro", category: "mobile", manufacturer: "Apple", width: 393, height: 852 },
    { id: "iphone-17", name: "iPhone 17", category: "mobile", manufacturer: "Apple", width: 393, height: 852 },
    { id: "iphone-17-pro", name: "iPhone 17 Pro", category: "mobile", manufacturer: "Apple", width: 393, height: 852 },
    { id: "iphone-17-pro-max", name: "iPhone 17 Pro Max", category: "mobile", manufacturer: "Apple", width: 430, height: 932 },
    { id: "iphone-17-air", name: "iPhone 17 Air", category: "mobile", manufacturer: "Apple", width: 428, height: 926 },
];

const IPAD_DEVICES: DevicePreset[] = [
    { id: "ipad", name: "iPad", category: "tablet", manufacturer: "Apple", width: 768, height: 1024 },
    { id: "ipad-mini", name: "iPad Mini", category: "tablet", manufacturer: "Apple", width: 768, height: 1024 },
    { id: "ipad-air", name: "iPad Air", category: "tablet", manufacturer: "Apple", width: 820, height: 1180 },
    { id: "ipad-pro", name: "iPad Pro", category: "tablet", manufacturer: "Apple", width: 1024, height: 1366 },
];

const GOOGLE_DEVICES: DevicePreset[] = [
    { id: "nexus-4", name: "Nexus 4", category: "mobile", manufacturer: "Google", width: 384, height: 640 },
    { id: "nexus-5", name: "Nexus 5", category: "mobile", manufacturer: "Google", width: 360, height: 640 },
    { id: "nexus-5x", name: "Nexus 5X", category: "mobile", manufacturer: "Google", width: 412, height: 732 },
    { id: "nexus-6", name: "Nexus 6", category: "mobile", manufacturer: "Google", width: 412, height: 732 },
    { id: "nexus-6p", name: "Nexus 6P", category: "mobile", manufacturer: "Google", width: 412, height: 732 },
    { id: "nexus-7", name: "Nexus 7", category: "tablet", manufacturer: "Google", width: 600, height: 960 },
    { id: "nexus-10", name: "Nexus 10", category: "tablet", manufacturer: "Google", width: 800, height: 1280 },
    { id: "pixel-2", name: "Pixel 2", category: "mobile", manufacturer: "Google", width: 411, height: 731 },
    { id: "pixel-2-xl", name: "Pixel 2 XL", category: "mobile", manufacturer: "Google", width: 411, height: 823 },
    { id: "pixel-3", name: "Pixel 3", category: "mobile", manufacturer: "Google", width: 393, height: 786 },
    { id: "pixel-3-xl", name: "Pixel 3 XL", category: "mobile", manufacturer: "Google", width: 393, height: 786 },
    { id: "pixel-4", name: "Pixel 4", category: "mobile", manufacturer: "Google", width: 353, height: 745 },
    { id: "pixel-5", name: "Pixel 5", category: "mobile", manufacturer: "Google", width: 393, height: 851 },
    { id: "pixel-7", name: "Pixel 7", category: "mobile", manufacturer: "Google", width: 412, height: 915 },
];

const SAMSUNG_DEVICES: DevicePreset[] = [
    { id: "galaxy-s3", name: "Galaxy S III", category: "mobile", manufacturer: "Samsung", width: 360, height: 640 },
    { id: "galaxy-s5", name: "Galaxy S5", category: "mobile", manufacturer: "Samsung", width: 360, height: 640 },
    { id: "galaxy-s8", name: "Galaxy S8", category: "mobile", manufacturer: "Samsung", width: 360, height: 740 },
    { id: "galaxy-s8-plus", name: "Galaxy S8+", category: "mobile", manufacturer: "Samsung", width: 360, height: 740 },
    { id: "galaxy-s9-plus", name: "Galaxy S9+", category: "mobile", manufacturer: "Samsung", width: 320, height: 658 },
    { id: "galaxy-s20", name: "Galaxy S20", category: "mobile", manufacturer: "Samsung", width: 360, height: 800 },
    { id: "galaxy-s20-plus", name: "Galaxy S20 Plus", category: "mobile", manufacturer: "Samsung", width: 384, height: 854 },
    { id: "galaxy-s20-ultra", name: "Galaxy S20 Ultra", category: "mobile", manufacturer: "Samsung", width: 412, height: 915 },
    { id: "galaxy-s21", name: "Galaxy S21", category: "mobile", manufacturer: "Samsung", width: 360, height: 800 },
    { id: "galaxy-s21-plus", name: "Galaxy S21 Plus", category: "mobile", manufacturer: "Samsung", width: 384, height: 854 },
    { id: "galaxy-s21-ultra", name: "Galaxy S21 Ultra", category: "mobile", manufacturer: "Samsung", width: 412, height: 915 },
    { id: "galaxy-s21-fe", name: "Galaxy S21 FE", category: "mobile", manufacturer: "Samsung", width: 360, height: 800 },
    { id: "galaxy-a51-71", name: "Galaxy A51/71", category: "mobile", manufacturer: "Samsung", width: 412, height: 914 },
    { id: "galaxy-note-2", name: "Galaxy Note II", category: "mobile", manufacturer: "Samsung", width: 360, height: 640 },
    { id: "galaxy-note-3", name: "Galaxy Note 3", category: "mobile", manufacturer: "Samsung", width: 360, height: 640 },
    { id: "galaxy-tab-s4", name: "Galaxy Tab S4", category: "tablet", manufacturer: "Samsung", width: 712, height: 1138 },
];

const FOLDABLE_DEVICES: DevicePreset[] = [
    { id: "galaxy-fold", name: "Galaxy Fold", category: "mobile", manufacturer: "Samsung", width: 280, height: 653 },
    { id: "galaxy-z-fold-5", name: "Galaxy Z Fold 5", category: "mobile", manufacturer: "Samsung", width: 344, height: 882 },
    { id: "galaxy-fold3-folded-portrait", name: "Galaxy Fold3 (Folded - Portrait)", category: "mobile", manufacturer: "Samsung", width: 320, height: 872 },
    { id: "galaxy-fold3-folded-landscape", name: "Galaxy Fold3 (Folded - Landscape)", category: "mobile", manufacturer: "Samsung", width: 872, height: 320 },
    { id: "galaxy-fold3-unfolded-portrait", name: "Galaxy Fold3 (Unfolded - Portrait)", category: "tablet", manufacturer: "Samsung", width: 900, height: 734 },
    { id: "galaxy-fold3-unfolded-landscape", name: "Galaxy Fold3 (Unfolded - Landscape)", category: "tablet", manufacturer: "Samsung", width: 734, height: 900 },
];

const SURFACE_DEVICES: DevicePreset[] = [
    { id: "surface-pro-7", name: "Surface Pro 7", category: "tablet", manufacturer: "Microsoft", width: 912, height: 1368 },
    { id: "surface-duo", name: "Surface Duo", category: "mobile", manufacturer: "Microsoft", width: 540, height: 720 },
];

const OTHER_DEVICES: DevicePreset[] = [
    { id: "nokia-lumia-520", name: "Nokia Lumia 520", category: "mobile", manufacturer: "Nokia", width: 320, height: 533 },
    { id: "lumia-550", name: "Microsoft Lumia 550", category: "mobile", manufacturer: "Microsoft", width: 640, height: 360 },
    { id: "lumia-950", name: "Microsoft Lumia 950", category: "mobile", manufacturer: "Microsoft", width: 360, height: 640 },
    { id: "blackberry-z30", name: "BlackBerry Z30", category: "mobile", manufacturer: "BlackBerry", width: 360, height: 640 },
    { id: "blackberry-playbook", name: "Blackberry PlayBook", category: "tablet", manufacturer: "BlackBerry", width: 600, height: 1024 },
    { id: "lg-optimus-l70", name: "LG Optimus L70", category: "mobile", manufacturer: "LG", width: 384, height: 640 },
    { id: "nokia-n9", name: "Nokia N9", category: "mobile", manufacturer: "Nokia", width: 480, height: 854 },
    { id: "jiophone-2", name: "JioPhone 2", category: "mobile", manufacturer: "Jio", width: 240, height: 320 },
    { id: "kindle-fire-hdx", name: "Kindle Fire HDX", category: "tablet", manufacturer: "Amazon", width: 800, height: 1280 },
    { id: "moto-g4", name: "Moto G4", category: "mobile", manufacturer: "Motorola", width: 360, height: 640 },
    { id: "asus-zenbook-fold", name: "Asus Zenbook Fold", category: "tablet", manufacturer: "Asus", width: 853, height: 1280 },
];

const SMART_DISPLAYS: DevicePreset[] = [
    { id: "nest-hub", name: "Nest Hub", category: "tablet", manufacturer: "Google", width: 1024, height: 600 },
    { id: "nest-hub-max", name: "Nest Hub Max", category: "tablet", manufacturer: "Google", width: 1280, height: 800 },
];

const LAPTOP_DEVICES: DevicePreset[] = [
    { id: "macbook-pro", name: "MacBook Pro", category: "laptop", manufacturer: "Apple", width: 1440, height: 900 },
    { id: "laptop-touch", name: "Laptop with Touch", category: "laptop", width: 950, height: 1280 },
    { id: "laptop-hidpi", name: "Laptop with HiDPI Screen", category: "laptop", width: 900, height: 1440 },
    { id: "laptop-mdpi", name: "Laptop with MDPI Screen", category: "laptop", width: 800, height: 1280 },
];

// Combined devices grouped by manufacturer
const DEVICE_GROUPS: Record<string, DevicePreset[]> = {
    Apple: [...IPHONE_DEVICES, ...IPAD_DEVICES],
    Google: [...GOOGLE_DEVICES, ...SMART_DISPLAYS],
    Samsung: [...SAMSUNG_DEVICES, ...FOLDABLE_DEVICES],
    Microsoft: [
        ...SURFACE_DEVICES,
        ...OTHER_DEVICES.filter((d) => d.manufacturer === "Microsoft"),
    ],
    Laptops: LAPTOP_DEVICES,
    Other: OTHER_DEVICES.filter((d) => d.manufacturer !== "Microsoft"),
};

// --- Main Component ---
export default function MobileTabletTester() {
    const [globalUrl, setGlobalUrl] = useState("");
    const [devices, setDevices] = useState<DeviceSlot[]>([
        { device: null, orientation: "portrait", url: "", isLoading: false, error: null, iframeKey: 0 },
    ]);
    const [showSettings, setShowSettings] = useState(false);
    const [showDeviceModal, setShowDeviceModal] = useState(false);
    const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Load global URL and apply to all devices
    const handleLoadGlobalUrl = () => {
        const normalized = normalizeUrl(globalUrl);
        if (!normalized || !isValidUrl(normalized)) {
            return;
        }

        setDevices((prev) =>
            prev.map((slot) => ({
                ...slot,
                url: normalized,
                isLoading: true,
                error: null,
            }))
        );
    };

    const normalizeUrl = (inputUrl: string): string => {
        const trimmed = inputUrl.trim();
        if (!trimmed) return "";
        if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
            return trimmed;
        }
        return `https://${trimmed}`;
    };

    const isValidUrl = (urlString: string): boolean => {
        try {
            new URL(urlString);
            return true;
        } catch {
            return false;
        }
    };

    const handleIframeLoad = (index: number) => {
        console.log(`Device ${index + 1} iframe loaded successfully`);
        setDevices((prev) =>
            prev.map((slot, i) =>
                i === index ? { ...slot, isLoading: false, error: null } : slot
            )
        );
    };

    const handleIframeError = (index: number) => {
        console.error(`Device ${index + 1} iframe failed to load`);
        setDevices((prev) =>
            prev.map((slot, i) =>
                i === index
                    ? {
                        ...slot,
                        isLoading: false,
                        error:
                            "This website cannot be displayed in an iframe. It may have security policies that prevent embedding.",
                    }
                    : slot
            )
        );
    };

    const toggleOrientation = (index: number) => {
        setDevices((prev) =>
            prev.map((slot, i) =>
                i === index
                    ? {
                        ...slot,
                        orientation: slot.orientation === "portrait" ? "landscape" : "portrait",
                    }
                    : slot
            )
        );
    };

    const handleRefresh = (index: number) => {
        setDevices((prev) =>
            prev.map((slot, i) =>
                i === index
                    ? { ...slot, iframeKey: slot.iframeKey + 1, isLoading: true, error: null }
                    : slot
            )
        );
    };

    const handleDeviceSelect = (device: DevicePreset) => {
        if (activeSlotIndex !== null) {
            setDevices((prev) =>
                prev.map((slot, i) =>
                    i === activeSlotIndex ? { ...slot, device } : slot
                )
            );
        }
        setShowDeviceModal(false);
        setSearchQuery("");
        setActiveSlotIndex(null);
    };

    const addDevice = () => {
        if (devices.length >= 2) return;
        setDevices((prev) => [
            ...prev,
            { device: null, orientation: "portrait", url: globalUrl, isLoading: false, error: null, iframeKey: 0 },
        ]);
    };

    const removeDevice = (index: number) => {
        if (devices.length === 1) return;
        setDevices((prev) => prev.filter((_, i) => i !== index));
    };

    const openDeviceModal = (index: number) => {
        setActiveSlotIndex(index);
        setShowDeviceModal(true);
    };

    const getViewportDimensions = (slot: DeviceSlot) => {
        if (!slot.device) {
            return { width: 375, height: 667 };
        }

        const { width, height } = slot.device;
        if (slot.orientation === "portrait") {
            return { width, height };
        }
        return { width: height, height: width };
    };

    const filteredDeviceGroups: Record<string, DevicePreset[]> = {};
    Object.entries(DEVICE_GROUPS).forEach(([group, groupDevices]) => {
        const filtered = groupDevices.filter((device) =>
            device.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (filtered.length > 0) {
            filteredDeviceGroups[group] = filtered;
        }
    });

    const getCategoryIcon = (category: string) => {
        if (category === "mobile") return <Smartphone className="h-4 w-4" />;
        if (category === "tablet") return <Tablet className="h-4 w-4" />;
        return <Monitor className="h-4 w-4" />;
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
            {/* Minimal Header - Very Compact */}
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 px-4 py-2">
                <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
                    {/* Breadcrumb - Compact */}
                    <div className="flex items-center space-x-2 text-xs">
                        <Link
                            href="/"
                            className="flex items-center text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            <HomeIcon className="h-3 w-3 mr-1" />
                            <span>Home</span>
                        </Link>
                        <ChevronRight className="h-3 w-3 text-slate-400" />
                        <span className="text-slate-900 dark:text-white font-medium">
                            Mobile & Tablet Tester
                        </span>
                    </div>

                    {/* Settings Button - Top Right */}
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        aria-label="Settings"
                    >
                        <Settings className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>
            </div>

            {/* Settings Panel - Slide from top */}
            {showSettings && (
                <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 shadow-lg animate-slideDown">
                    <div className="max-w-screen-2xl mx-auto">
                        <div className="flex items-center space-x-3">
                            <input
                                type="text"
                                value={globalUrl}
                                onChange={(e) => setGlobalUrl(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleLoadGlobalUrl()}
                                placeholder="Enter URL (e.g., example.com)"
                                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <button
                                onClick={handleLoadGlobalUrl}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Load
                            </button>
                            {devices.length === 1 && (
                                <button
                                    onClick={addDevice}
                                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                    aria-label="Add device"
                                >
                                    <Plus className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Device Previews - Clean Canvas, No Containers */}
            <div className="p-4 min-h-screen flex items-start justify-center">
                <div className={`grid ${devices.length === 2 ? "grid-cols-2 gap-8" : "grid-cols-1"} w-full max-w-screen-2xl`}>
                    {devices.map((slot, index) => {
                        const { width, height } = getViewportDimensions(slot);

                        // Calculate scale to fit viewport (client-side only)
                        const maxWidth = typeof window !== 'undefined'
                            ? (devices.length === 2 ? window.innerWidth / 2 - 80 : window.innerWidth - 80)
                            : 800;
                        const maxHeight = typeof window !== 'undefined'
                            ? window.innerHeight - 200
                            : 600;
                        const scaleX = maxWidth / width;
                        const scaleY = maxHeight / height;
                        const scale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down

                        return (
                            <div
                                key={index}
                                className="flex items-start justify-center"
                            >
                                {!slot.url ? (
                                    <div className="text-center py-20">
                                        <Monitor className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                                        <p className="text-slate-500 dark:text-slate-400">
                                            Enter a URL to preview
                                        </p>
                                    </div>
                                ) : slot.error ? (
                                    <div className="text-center py-20 px-4">
                                        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                                        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mb-4">
                                            {slot.error}
                                        </p>
                                        <button
                                            onClick={() => window.open(slot.url, "_blank")}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                                        >
                                            Open in New Tab
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-full flex flex-col items-center">
                                        {/* Ultra-Minimal Controls - ABOVE Device */}
                                        <div className="w-full max-w-fit flex items-center space-x-2 px-3 py-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full shadow-sm border border-slate-200 dark:border-slate-700 mb-2">
                                            {/* Device Selector */}
                                            <button
                                                onClick={() => openDeviceModal(index)}
                                                className="flex items-center space-x-1.5 px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                                            >
                                                {slot.device && getCategoryIcon(slot.device.category)}
                                                <span className="text-xs font-medium text-slate-900 dark:text-white">
                                                    {slot.device ? slot.device.name : "Select"}
                                                </span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                                    {width}×{height}
                                                </span>
                                            </button>

                                            <div className="h-4 w-px bg-slate-300 dark:bg-slate-600"></div>

                                            {/* Control Buttons */}
                                            <button
                                                onClick={() => toggleOrientation(index)}
                                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                                                title={slot.orientation}
                                            >
                                                <RotateCw className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                                            </button>
                                            <button
                                                onClick={() => handleRefresh(index)}
                                                disabled={!slot.url}
                                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors disabled:opacity-50"
                                                title="Refresh"
                                            >
                                                <RefreshCw className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                                            </button>
                                            {devices.length > 1 && (
                                                <button
                                                    onClick={() => removeDevice(index)}
                                                    className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full transition-colors"
                                                    title="Remove"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Device Frame with scaling */}
                                        <div
                                            className="bg-slate-900 dark:bg-slate-950 rounded-3xl shadow-2xl p-3 transition-all duration-300"
                                            style={{
                                                transform: `scale(${scale})`,
                                                transformOrigin: "top center",
                                            }}
                                        >
                                            <div
                                                className="relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-inner"
                                                style={{ width: `${width}px`, height: `${height}px` }}
                                            >
                                                {slot.isLoading && (
                                                    <div className="absolute inset-0 bg-white dark:bg-slate-800 flex items-center justify-center z-10">
                                                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                                                    </div>
                                                )}
                                                <iframe
                                                    key={slot.iframeKey}
                                                    src={slot.url}
                                                    onLoad={() => handleIframeLoad(index)}
                                                    onError={() => handleIframeError(index)}
                                                    className="w-full h-full border-0"
                                                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                                                    title={`Device Preview ${index + 1}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Device Selection Modal */}
            {showDeviceModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Select Device
                            </h3>
                            <button
                                onClick={() => {
                                    setShowDeviceModal(false);
                                    setSearchQuery("");
                                    setActiveSlotIndex(null);
                                }}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search devices..."
                                    className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Device List */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {Object.entries(filteredDeviceGroups).map(([group, groupDevices]) => (
                                <div key={group} className="mb-4 last:mb-0">
                                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-2">
                                        {group}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {groupDevices.map((device) => (
                                            <button
                                                key={device.id}
                                                onClick={() => handleDeviceSelect(device)}
                                                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 border border-transparent transition-all text-left"
                                            >
                                                <div className="flex items-center space-x-2 flex-1">
                                                    {getCategoryIcon(device.category)}
                                                    <span className="text-sm text-slate-900 dark:text-white font-medium">
                                                        {device.name}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                                    {device.width} × {device.height}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
        </div>
    );
}
