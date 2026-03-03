import React from 'react';
import Layout from '../components/Layout/Layout';
import NewsFeed from '../components/News/NewsFeed';

const NewsPage = () => {
    return (
        <Layout>
            <div className="sticky top-0 z-20 bg-obsidian/80 backdrop-blur-md border-b border-white/5 p-4 md:px-8 flex items-center justify-between">
                <h2 className="text-xl font-bold uppercase tracking-widest text-white">Official News</h2>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-smoke bg-white/5 px-3 py-1 rounded-full border border-white/10">
                        Steam Feed
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-8 pb-12">
                {/* Featured Video Section */}
                <section className="relative w-full bg-black">
                    {/* Thematic top/bottom borders */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-dbd-red to-transparent opacity-50 z-10" />

                    <div className="relative w-full max-w-7xl mx-auto">
                        <div className="aspect-w-16 aspect-h-9 md:aspect-video w-full">
                            <iframe
                                src="https://www.youtube.com/embed/GBHMeo6_RRU?si=2T2J_f2-r22e2-M&autoplay=1&mute=1"
                                title="Dead by Daylight Featured Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="w-full h-full object-cover"
                            ></iframe>
                        </div>

                        {/* Overlay Gradients to blend into the dark theme */}
                        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent pointer-events-none" />
                        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-obsidian to-transparent pointer-events-none hidden md:block" />
                        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-obsidian to-transparent pointer-events-none hidden md:block" />
                    </div>

                    <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50 z-10" />
                </section>

                <section className="max-w-7xl mx-auto w-full">
                    <NewsFeed />
                </section>
            </div>
        </Layout>
    );
};

export default NewsPage;