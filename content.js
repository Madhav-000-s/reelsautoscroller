// Instagram Reels Auto Scroller - Fixed Version with Working Scroll
console.log('🚀 Instagram Auto Scroller Fixed Version Loading...');

class InstagramReelsAutoScroller {
    constructor() {
        this.settings = {
            enabled: true,
            delayAfterFinish: 2,    // seconds to wait after video ends
            maxWaitTime: 30,        // max seconds to wait before forcing scroll
        };
        
        this.currentVideoElement = null;
        this.scrollTimeout = null;
        this.videoEndedTimeout = null;
        this.isProcessing = false;
        this.lastScrollTime = 0;
        this.debugInfo = [];
        this.lastLoggedProgress = 0;
        
        // Video selector
        this.VIDEOS_LIST_SELECTOR = "main video";
        
        this.init();
    }
    
    log(message, data = null) {
        const timestamp = new Date().toLocaleTimeString();
        const logMessage = `[${timestamp}] 📱 Instagram Auto Scroller: ${message}`;
        console.log(logMessage, data || '');
        this.debugInfo.push({ timestamp, message, data });
    }
    
    init() {
        this.log('Initializing...');
        
        // Wait for page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startWatching());
        } else {
            this.startWatching();
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                this.toggleAutoScroll();
            }
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.log('🧪 Manual scroll test triggered');
                this.scrollToNextVideo();
            }
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.printDebugInfo();
            }
        });
        
        this.log('Keyboard shortcuts registered:');
        this.log('  Ctrl+Shift+A = Toggle on/off');
        this.log('  Ctrl+Shift+T = Test scroll to next video');
        this.log('  Ctrl+Shift+D = Print debug info');
    }
    
    startWatching() {
        this.log('Starting to watch for videos...');
        
        // Check every few seconds for new videos
        setInterval(() => {
            if (this.settings.enabled && this.isOnReelsPage() && !this.isProcessing) {
                this.checkCurrentVideo();
            }
        }, 1000);
        
        // Watch for URL changes (single page app)
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                this.log('URL changed to:', url);
                setTimeout(() => this.checkCurrentVideo(), 1000);
            }
        }).observe(document.body, { childList: true, subtree: true });
    }
    
    isOnReelsPage() {
        const isReels = window.location.pathname.includes('/reels/') || 
                       window.location.pathname === '/reels' ||
                       document.querySelector('video') !== null;
        return isReels;
    }
    
    // Get current video that's in view (using your method)
    getCurrentVideo() {
        return Array.from(document.querySelectorAll(this.VIDEOS_LIST_SELECTOR)).find(
            (video) => {
                const videoRect = video.getBoundingClientRect();
                const isVideoInView = 
                    videoRect.top >= -100 && // Allow some tolerance
                    videoRect.left >= 0 &&
                    videoRect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + 100 &&
                    videoRect.right <= (window.innerWidth || document.documentElement.clientWidth);
                return isVideoInView;
            }
        );
    }
    
    checkCurrentVideo() {
        const videoElement = this.getCurrentVideo();
        if (videoElement && videoElement !== this.currentVideoElement) {
            this.log('New video detected');
            this.watchVideo(videoElement);
        }
    }
    
    watchVideo(videoElement) {
        this.currentVideoElement = videoElement;
        this.clearTimeouts();
        
        this.log('Now watching video:', {
            duration: videoElement.duration,
            currentTime: videoElement.currentTime,
            paused: videoElement.paused,
            ended: videoElement.ended,
            src: videoElement.src?.substring(0, 50) + '...'
        });
        
        // Set maximum wait timeout
        this.scrollTimeout = setTimeout(() => {
            this.scrollToNext('max wait time reached');
        }, this.settings.maxWaitTime * 1000);
        
        // Watch for video end
        const onVideoEnd = () => {
            this.log('Video ended, waiting before scroll...');
            this.videoEndedTimeout = setTimeout(() => {
                this.scrollToNext('video ended');
            }, this.settings.delayAfterFinish * 1000);
        };
        
        // Listen for ended event
        videoElement.addEventListener('ended', onVideoEnd, { once: true });
        
        // Monitor progress to catch videos that might not fire 'ended'
        const progressChecker = () => {
            if (this.currentVideoElement !== videoElement) return;
            
            const { duration, currentTime } = videoElement;
            if (duration && currentTime) {
                const progress = (currentTime / duration) * 100;
                
                // Log progress every 25%
                if (Math.floor(progress / 25) * 25 !== this.lastLoggedProgress && Math.floor(progress) % 25 === 0) {
                    this.lastLoggedProgress = Math.floor(progress / 25) * 25;
                    this.log(`Video progress: ${Math.floor(progress)}%`);
                }
                
                // If video is essentially finished
                if (currentTime >= duration - 0.5 || currentTime / duration >= 0.98) {
                    this.log('Video nearly finished, triggering end sequence...');
                    onVideoEnd();
                    return;
                }
            }
            
            // Continue checking every second
            setTimeout(progressChecker, 1000);
        };
        
        // Start progress checking after a short delay
        setTimeout(progressChecker, 1000);
    }
    
    clearTimeouts() {
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = null;
        }
        if (this.videoEndedTimeout) {
            clearTimeout(this.videoEndedTimeout);
            this.videoEndedTimeout = null;
        }
    }
    
    scrollToNext(reason) {
        // Prevent rapid scrolling
        const now = Date.now();
        if (now - this.lastScrollTime < 3000) {
            this.log('❌ Scroll prevented - too soon after last scroll');
            return;
        }
        
        if (this.isProcessing) {
            this.log('❌ Scroll prevented - already processing');
            return;
        }
        
        this.isProcessing = true;
        this.lastScrollTime = now;
        this.clearTimeouts();
        
        this.log(`🎯 Scrolling to next reel: ${reason}`);
        
        // Use your working scroll method
        this.scrollToNextVideo();
        
        // Reset after delay
        setTimeout(() => {
            this.isProcessing = false;
            this.currentVideoElement = null;
            this.log('✅ Processing reset - ready for next video');
        }, 2000);
    }
    
    // Your working scroll method (slightly modified)
    scrollToNextVideo(direction = "down") {
        const VIDEOS_LIST = Array.from(document.querySelectorAll(this.VIDEOS_LIST_SELECTOR));
        const currentVideo = this.getCurrentVideo();
        
        this.log(`Found ${VIDEOS_LIST.length} total videos`);
        
        if (!currentVideo) {
            this.log('❌ No current video found for scrolling');
            return;
        }
        
        const index = VIDEOS_LIST.findIndex(vid => vid.src && vid.src === currentVideo.src);
        this.log(`Current video index: ${index}`);
        
        const nextVideo = VIDEOS_LIST[index + (direction === "down" ? 1 : -1)];
        
        if (nextVideo) {
            this.log(`✅ Scrolling to next video (index ${index + (direction === "down" ? 1 : -1)})`);
            nextVideo.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "center",
            });
        } else {
            this.log('❌ No next video found');
        }
    }
    
    toggleAutoScroll() {
        this.settings.enabled = !this.settings.enabled;
        
        const message = this.settings.enabled ? 
            '✅ Instagram Auto Scroller ENABLED' : 
            '❌ Instagram Auto Scroller DISABLED';
            
        this.log(message);
        this.showNotification(message);
        
        if (!this.settings.enabled) {
            this.clearTimeouts();
            this.isProcessing = false;
            this.currentVideoElement = null;
        }
    }
    
    showNotification(message) {
        // Remove any existing notification
        const existing = document.getElementById('instagram-auto-scroll-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.id = 'instagram-auto-scroll-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
            text-align: center;
            min-width: 200px;
        `;
        
        // Add animation keyframes if not already present
        if (!document.querySelector('#auto-scroll-styles')) {
            const style = document.createElement('style');
            style.id = 'auto-scroll-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideIn 0.3s ease-out reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }
    
    printDebugInfo() {
        this.log('=== DEBUG INFO START ===');
        this.log('Current URL:', window.location.href);
        this.log('Is on reels page:', this.isOnReelsPage());
        this.log('Auto scroll enabled:', this.settings.enabled);
        this.log('Currently processing:', this.isProcessing);
        this.log('Current video element:', this.currentVideoElement);
        this.log('Videos found:', document.querySelectorAll(this.VIDEOS_LIST_SELECTOR).length);
        this.log('Current video from getCurrentVideo():', this.getCurrentVideo());
        this.log('=== RECENT ACTIVITY ===');
        this.debugInfo.slice(-10).forEach(info => {
            this.log(`[${info.timestamp}] ${info.message}`, info.data);
        });
        this.log('=== DEBUG INFO END ===');
        
        // Also create a summary for easy copying
        const summary = {
            url: window.location.href,
            isReelsPage: this.isOnReelsPage(),
            enabled: this.settings.enabled,
            processing: this.isProcessing,
            hasCurrentVideo: !!this.currentVideoElement,
            videoCount: document.querySelectorAll(this.VIDEOS_LIST_SELECTOR).length,
            currentVideoSrc: this.getCurrentVideo()?.src?.substring(0, 50) + '...',
            recentActivity: this.debugInfo.slice(-5)
        };
        
        console.log('📋 COPY THIS DEBUG SUMMARY:', JSON.stringify(summary, null, 2));
    }
}

// Initialize
let autoScroller = null;

function initializeAutoScroller() {
    if (!autoScroller) {
        autoScroller = new InstagramReelsAutoScroller();
        
        // Make it globally accessible for debugging
        window.instagramAutoScroller = autoScroller;
        
        console.log('🎉 Instagram Auto Scroller Fixed Version Ready!');
        console.log('📝 Available shortcuts:');
        console.log('   Ctrl+Shift+A = Toggle on/off');
        console.log('   Ctrl+Shift+T = Test scroll to next video');
        console.log('   Ctrl+Shift+D = Print debug info');
        console.log('');
        console.log('💡 Manual functions available:');
        console.log('   window.instagramAutoScroller.scrollToNextVideo() - Scroll down');
        console.log('   window.instagramAutoScroller.scrollToNextVideo("up") - Scroll up');
    }
}

// Start when page is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAutoScroller);
} else {
    initializeAutoScroller();
}
