/**
 * Novelskyworld - Ad Manager (Arabic Site)
 * Repository: rrrtfdeee-art/nsw-ads
 * CDN: https://cdn.jsdelivr.net/gh/rrrtfdeee-art/nsw-ads@main/nsw-ads-ar.js
 */
(function() {
    'use strict';

    var CONFIG = {
        site: 'ar',
        reportUrl: '/p/feedback.html',
        socialBarIntervalMin: 10,
        zones: {
            socialBar: {
                id: '28261592',
                scriptUrl: ''
            },
            nativeBanner: {
                id: '28261598',
                scriptUrl: '',
                containerId: ''
            },
            banner728: {
                id: '28261570',
                key: '',
                width: 728,
                height: 90,
                scriptUrl: ''
            }
        }
    };

    function injectStyles() {
        if (document.getElementById('nsw-ad-styles')) return;
        var style = document.createElement('style');
        style.id = 'nsw-ad-styles';
        style.textContent = `
            .nsw-ad-slot {
                display: block;
                margin: 28px auto;
                text-align: center;
                max-width: 100%;
                clear: both;
            }
            .nsw-ad-card {
                display: inline-block;
                width: 100%;
                max-width: 760px;
                padding: 12px 10px 10px;
                border-radius: 10px;
                box-sizing: border-box;
                position: relative;
                transition: background-color 0.3s ease, border-color 0.3s ease;
                background: rgba(125, 125, 125, 0.04);
                border: 1px dashed rgba(197, 160, 89, 0.35);
            }
            /* توافق الثيمات الخمسة */
            [data-reader-theme="obsidian"] .nsw-ad-card, [data-theme="obsidian"] .nsw-ad-card {
                background: #0a0d16;
                border-color: rgba(197, 160, 89, 0.25);
            }
            [data-reader-theme="oled"] .nsw-ad-card, [data-theme="oled"] .nsw-ad-card {
                background: #000000;
                border-color: #222222;
            }
            [data-reader-theme="charcoal"] .nsw-ad-card, [data-theme="charcoal"] .nsw-ad-card {
                background: #181b22;
                border-color: #2b3240;
            }
            [data-reader-theme="sepia"] .nsw-ad-card, [data-theme="sepia"] .nsw-ad-card {
                background: #ecdfc4;
                border-color: #cbbba0;
            }
            [data-reader-theme="white"] .nsw-ad-card, [data-theme="white"] .nsw-ad-card {
                background: #ffffff;
                border-color: #e5e7eb;
                box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            }

            .nsw-ad-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 11.5px;
                margin-bottom: 8px;
                padding: 0 4px;
                color: var(--text-secondary, #888888);
                direction: rtl;
            }
            .nsw-ad-badge {
                font-weight: 600;
                color: var(--accent-gold, #c5a059);
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .nsw-ad-report-link {
                color: var(--text-secondary, #888888);
                text-decoration: underline;
                font-size: 11px;
                transition: color 0.2s;
            }
            .nsw-ad-report-link:hover {
                color: #e63946;
            }
            .nsw-ad-content {
                min-height: 90px;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
            }
        `;
        document.head.appendChild(style);
    }

    function initSocialBar() {
        if (!CONFIG.zones.socialBar.scriptUrl) return;
        var STORAGE_KEY = 'nsw_last_socialbar_ts';
        var intervalMs = (CONFIG.socialBarIntervalMin || 10) * 60 * 1000;
        var now = Date.now();
        var last = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);

        function trigger() {
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = CONFIG.zones.socialBar.scriptUrl;
            document.body.appendChild(s);
            localStorage.setItem(STORAGE_KEY, Date.now().toString());
        }

        if (!last || (now - last) >= intervalMs) {
            trigger();
        }

        setInterval(function() {
            var curNow = Date.now();
            var curLast = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
            if ((curNow - curLast) >= intervalMs) {
                trigger();
            }
        }, 60000);
    }

    function createAdBox(type, zoneId) {
        var slot = document.createElement('div');
        slot.className = 'nsw-ad-slot';
        slot.setAttribute('data-ad-type', type);
        slot.setAttribute('data-zone-id', zoneId || '');

        var card = document.createElement('div');
        card.className = 'nsw-ad-card';

        var header = document.createElement('div');
        header.className = 'nsw-ad-header';
        header.innerHTML = `
            <span class="nsw-ad-badge">✨ إعلان مدعوم</span>
            <a href="${CONFIG.reportUrl}" target="_blank" rel="noopener noreferrer" class="nsw-ad-report-link">
                هل يبدو الإعلان مضللاً أو مسيئاً؟ أبلغنا
            </a>
        `;

        var content = document.createElement('div');
        content.className = 'nsw-ad-content';
        content.id = 'nsw-ad-' + Math.random().toString(36).substring(2, 9);

        card.appendChild(header);
        card.appendChild(content);
        slot.appendChild(card);

        return { slot: slot, contentId: content.id };
    }

    var adObserver = null;
    function observeAd(slotElement, renderCallback) {
        if ('IntersectionObserver' in window) {
            if (!adObserver) {
                adObserver = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            var el = entry.target;
                            var cb = el._renderCallback;
                            if (cb) {
                                cb();
                                delete el._renderCallback;
                            }
                            adObserver.unobserve(el);
                        }
                    });
                }, { rootMargin: '250px 0px' });
            }
            slotElement._renderCallback = renderCallback;
            adObserver.observe(slotElement);
        } else {
            renderCallback();
        }
    }

    function injectAdsIntoContainer(container) {
        if (!container || container.getAttribute('data-ads-injected') === 'true') return;
        container.setAttribute('data-ads-injected', 'true');

        var paragraphs = Array.from(container.querySelectorAll('.nsw-paragraph, p')).filter(function(p) {
            return !p.closest('.nsw-ad-slot') && (p.textContent || '').trim().length > 15;
        });

        var total = paragraphs.length;
        if (total >= 6) {
            var pos1 = Math.floor(total * 0.33);
            var box1 = createAdBox('native', CONFIG.zones.nativeBanner.id);
            paragraphs[pos1].after(box1.slot);
            observeAd(box1.slot, function() {
                // سيتم تفعيل كود Native Banner هنا
            });

            if (total >= 14) {
                var pos2 = Math.floor(total * 0.68);
                var box2 = createAdBox('banner728', CONFIG.zones.banner728.id);
                paragraphs[pos2].after(box2.slot);
                observeAd(box2.slot, function() {
                    // سيتم تفعيل كود Banner 728x90 هنا
                });
            }
        }

        var nav = container.querySelector('.nsw-chapter-nav') || document.querySelector('.nsw-chapter-nav');
        var transBox = createAdBox('transition', CONFIG.zones.nativeBanner.id);
        if (nav && nav.parentNode) {
            nav.parentNode.insertBefore(transBox.slot, nav);
        } else {
            container.appendChild(transBox.slot);
        }
        observeAd(transBox.slot, function() {
            // كود إعلان الانتقال بين الفصول
        });
    }

    function init() {
        injectStyles();
        initSocialBar();

        var mainBody = document.querySelector('#nsw-text-body, .actual-text, #reading-content');
        if (mainBody) {
            injectAdsIntoContainer(mainBody);
        }

        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(m) {
                m.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        if (node.classList && node.classList.contains('infinite-chapter-block')) {
                            injectAdsIntoContainer(node);
                        } else {
                            var blocks = node.querySelectorAll ? node.querySelectorAll('.infinite-chapter-block') : [];
                            blocks.forEach(function(b) { injectAdsIntoContainer(b); });
                        }
                    }
                });
            });
        });

        var targetObserve = document.querySelector('#reading-content, .nsw-chapter-wrapper, #main, .main') || document.body;
        observer.observe(targetObserve, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
