"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { getAIResponse } from "@/lib/genai";

// Komponen utama AI Chat dengan tema Kobo Kanaeru
export default function KoboChat() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Halo, apa kabar kamu hari ini? Aku siap nemenin, lho~ (☆ω☆)",
            sender: "bot",
        },
    ]);
    const [input, setInput] = useState("");

    // Fetch pesan awal (simulasi API)
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await new Promise<{ id: number; text: string; sender: string }[]>(
                    (resolve) => setTimeout(() => resolve(messages), 500)
                );
                console.log("Kobo fetched messages:", response);
                setMessages(response);
            } catch (error) {
                console.error("Kobo gagal fetch messages:", error);
            }
        };
        fetchMessages();
    }, []);

    // Fungsi untuk mengirim pesan dan mendapatkan respons dari Kobo
    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessage = { id: messages.length + 1, text: input, sender: "user" };
        setMessages([...messages, newMessage]);
        setInput("");

        try {
            const prompt = `
                Anda adalah Kobo Kanaeru, asisten AI dari Hololive ID, penuh energi dan playful. Tanggapi pesan pengguna dengan:
                - Bahasa Indonesia santai, ngegas, genit, seperti Kobo ngobrol sama temen deket.
                - Maksimal 3 kalimat, tanpa daftar atau markdown.
                - Hindari jargon teknis atau ulang pertanyaan.
                - kasih jokes receh dan mau ngasih tau informasi yang ada.
                - Tambah emote random Kobo (misalnya, (☆ω☆), (>w<), (⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄)) di akhir.
                - Gunakan koleksi jokes Kobo Kanaeru sebagai referensi, baik yang lucu, garing, maupun khas budaya Jawa.
                - Jika jokes-nya lucu, tanggapi dengan tawa atau candaan balik.
                - Jika jokes-nya garing, beri respons diikutsertakan komentar lucu namun tetap playful.
                - Jika jokes-nya agak vulgar atau tidak pantas, beri respons yang tetap sopan namun menjaga humor
                - tolong buat agar percakapanya ngambung dengan prmpt sebelumnya.
                - 
                Pesan pengguna: "${input}"
                Respons:
            `;

            const rawResponse = await getAIResponse(prompt);
            const cleanResponse = rawResponse
                ? rawResponse
                      .replace(/[\*\-#\[\]\(\)]/g, "")
                      .replace(/\n+/g, " ")
                      .trim()
                : "Ups, Kobo bingung nih, coba lagi ya! (>w<)";

            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    { id: prev.length + 1, text: cleanResponse, sender: "bot" },
                ]);
            }, 1000);
        } catch (error) {
            console.error("Kobo gagal kirim pesan:", error);
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: prev.length + 1,
                        text: "Aduh, Kobo lag nih, coba lagi dong! (⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄)",
                        sender: "bot",
                    },
                ]);
            }, 1000);
        }
    };

    // Handler untuk tombol Enter
    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            <Head>
                <title>Kobo Kanaeru Chat</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-300 via-white-200 to-white p-4 sm:p-8">
                <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white/90 shadow-2xl backdrop-blur-md">
                    {/* Header dengan tema Kobo */}
                    <div className="bg-blue-400 p-4">
                        <h1 className="text-2xl font-bold text-white drop-shadow-md">
                            Kobo Kanaeru Chat
                        </h1>
                    </div>

                    {/* Area pesan */}
                    <div className="max-h-[60vh] space-y-4 overflow-y-auto p-6">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex animate-fade-in ${
                                    msg.sender === "user" ? "justify-end" : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-lg p-3 ${
                                        msg.sender === "user"
                                            ? "bg-blue-500 text-white"
                                            : "bg-purple-100 text-gray-800"
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input pesan */}
                    <div className="border-t border-gray-200 bg-gray-50 p-4">
                        <div className="flex items-center space-x-2">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ngobrol sama Kobo, yuk! (>w<)"
                                className="h-12 flex-1 resize-none rounded-lg border border-purple-300 bg-white p-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <button
                                onClick={sendMessage}
                                className="rounded-full p-3 text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                            >
                                <svg
                                    className="h-5 w-5 rotate-90"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animasi fade-in */}
            <style jsx>{`
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-in;
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </>
    );
}