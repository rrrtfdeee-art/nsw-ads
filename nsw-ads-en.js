/**
 * Novelskyworld - Ad Manager (English Site)
 * Repository: rrrtfdeee-art/nsw-ads
 * Version: 2.1.0 - Clean A-Ads (Dual Units: In-Chapter + Royal Sticky Anchor with 10-min dismiss)
 */
(function() {
    'use strict';

    // Early DNS prefetch & preconnect to eliminate ad SSL handshake delay
    try {
        ['https://acceptable.a-ads.com', 'https://aads.com'].forEach(function(orig) {
            var d = document.createElement('link'); d.rel = 'dns-prefetch'; d.href = orig; document.head.appendChild(d);
            var p = document.createElement('link'); p.rel = 'preconnect'; p.href = orig; p.crossOrigin = 'anonymous'; document.head.appendChild(p);
        });
    } catch(e) {}

    var CONFIG = {
        site: 'en',
        reportUrl: 'https://en.novelskyworld.com/p/feedback.html',
        bodyUnitId: '2459344',
        stickyUnitId: '2459346',
        stickyCooldownMin: 10
    };

    function isMobileDevice() {
        return window.innerWidth < 768;
    }

    // 1. توليد رابط إبلاغ ثلاثي الحماية
    function prepareAdReportData(adType, zoneId) {
        var base = CONFIG.reportUrl;
        var currentUrl = window.location.href;
        var novelEl = document.getElementById('dynamic-novel-name');
        var novel = novelEl ? novelEl.textContent.trim() : '';
        var headingEl = document.querySelector('#reading-content h1, .nsw-chapter-wrapper h1');
        var chapter = headingEl ? headingEl.textContent.trim() : (document.title || '');

        var reportPayload = {
            type: 'ad_report',
            ad_type: adType || 'A-Ads Banner',
            zone_id: zoneId || CONFIG.bodyUnitId,
            novel: novel,
            chapter: chapter,
            page_url: currentUrl,
            timestamp: new Date().toLocaleString('ar-EG')
        };

        var queryStr = 'm=1&type=ad_report' +
            '&ad_type=' + encodeURIComponent(reportPayload.ad_type) +
            '&zone_id=' + encodeURIComponent(reportPayload.zone_id) +
            '&novel=' + encodeURIComponent(reportPayload.novel) +
            '&chapter=' + encodeURIComponent(reportPayload.chapter) +
            '&page_url=' + encodeURIComponent(reportPayload.page_url);

        var hashStr = 'ad_report_data=' + encodeURIComponent(JSON.stringify(reportPayload));

        return {
            url: base + '?' + queryStr + '#' + hashStr,
            payload: reportPayload
        };
    }

    // 2. حقن الاستايل المتوافق مع الثيمات الملكية والشريط العائم
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
                max-width: 728px;
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid rgba(197, 160, 89, 0.22);
                border-radius: 12px;
                padding: 10px 14px 14px 14px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
                box-sizing: border-box;
                text-align: center;
                transition: border-color 0.25s ease;
            }
            .nsw-ad-card:hover {
                border-color: rgba(197, 160, 89, 0.45);
            }
            .nsw-ad-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 8px;
                padding-bottom: 6px;
                border-bottom: 1px solid rgba(197, 160, 89, 0.12);
                font-size: 11px;
                font-family: inherit;
            }
            .nsw-ad-badge {
                color: #c5a059;
                font-weight: 700;
                letter-spacing: 0.5px;
            }
            .nsw-ad-report-link {
                color: #888888;
                text-decoration: none;
                transition: color 0.2s ease;
                font-size: 10.5px;
            }
            .nsw-ad-report-link:hover {
                color: #ef4444;
                text-decoration: underline;
            }
            .nsw-ad-content {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 90px;
                margin: 0 auto;
                width: 100%;
                overflow: hidden;
            }
            .nsw-ad-content iframe {
                border: 0;
                padding: 0;
                width: 100%;
                max-width: 728px;
                height: 90px;
                min-height: 90px;
                overflow: hidden;
                display: block;
                margin: auto;
            }
            @media (max-width: 767px) {
                .nsw-ad-card {
                    padding: 8px 10px 10px 10px;
                    border-radius: 8px;
                    max-width: 100%;
                }
                .nsw-ad-content iframe {
                    height: 100px;
                    min-height: 100px;
                }
            }

            /* 🌟 الشريط العائم السفلي الملكي (Royal Sticky Anchor Bar) */
            .nsw-sticky-anchor-bar {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                width: 100%;
                z-index: 99990;
                background: rgba(15, 17, 23, 0.95);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border-top: 1.5px solid rgba(197, 160, 89, 0.4);
                padding: 4px 8px;
                box-shadow: 0 -4px 25px rgba(0, 0, 0, 0.45);
                text-align: center;
                transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                box-sizing: border-box;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .nsw-sticky-anchor-bar.nsw-sticky-hidden {
                transform: translateY(125%) !important;
                pointer-events: none !important;
            }
            .nsw-sticky-close-tab {
                position: absolute;
                top: -24px;
                right: 18px;
                background: rgba(15, 17, 23, 0.95);
                border: 1px solid rgba(197, 160, 89, 0.45);
                border-bottom: none;
                border-radius: 6px 6px 0 0;
                color: #c5a059;
                padding: 2px 10px;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                font-weight: 700;
                gap: 5px;
                box-shadow: 0 -2px 10px rgba(0,0,0,0.25);
                transition: background 0.2s, color 0.2s;
                user-select: none;
            }
            .nsw-sticky-close-tab:hover {
                background: #c5a059;
                color: #0b0e14;
            }
            .nsw-sticky-close-tab svg {
                fill: currentColor;
                transition: fill 0.2s;
            }
            .nsw-sticky-inner {
                width: 100%;
                max-width: 728px;
                min-height: 50px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .nsw-sticky-inner iframe {
                border: 0;
                padding: 0;
                width: 100%;
                max-width: 728px;
                height: 60px;
                min-height: 50px;
                overflow: hidden;
                display: block;
                margin: auto;
            }
            @media (max-width: 767px) {
                .nsw-sticky-anchor-bar {
                    padding: 3px 4px;
                }
                .nsw-sticky-inner iframe {
                    height: 55px;
                }
                .nsw-sticky-close-tab {
                    right: 10px;
                    top: -22px;
                    padding: 2px 8px;
                    font-size: 10px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // 3. بناء صناديق إعلانات المتن (الوحدة 2459344)
    function createAdBox(label) {
        var slot = document.createElement('div');
        slot.className = 'nsw-ad-slot';
        slot.setAttribute('data-ad-type', label);

        var card = document.createElement('div');
        card.className = 'nsw-ad-card';

        var reportData = prepareAdReportData(label, CONFIG.bodyUnitId);

        var header = document.createElement('div');
        header.className = 'nsw-ad-header';
        header.innerHTML = `
            <span class="nsw-ad-badge">✨ Sponsored Ad</span>
            <a href="${reportData.url}" target="_blank" rel="noopener noreferrer" class="nsw-ad-report-link">
                Report misleading or inappropriate ad
            </a>
        `;

        var content = document.createElement('div');
        content.className = 'nsw-ad-content';

        card.appendChild(header);
        card.appendChild(content);
        slot.appendChild(card);

        return { slot: slot, content: content };
    }

    // 4. حقن بنر A-Ads
    function renderAAdsFrame(targetEl, unitId, minHeight) {
        var iframe = document.createElement('iframe');
        iframe.setAttribute('data-aa', unitId);
        iframe.src = 'https://acceptable.a-ads.com/' + unitId + '/?size=Adaptive';
        iframe.style.border = '0';
        iframe.style.padding = '0';
        iframe.style.width = '100%';
        iframe.style.height = 'auto';
        iframe.style.minHeight = minHeight || (isMobileDevice() ? '100px' : '90px');
        iframe.style.overflow = 'hidden';
        iframe.style.display = 'block';
        iframe.style.margin = 'auto';
        iframe.scrolling = 'no';
        targetEl.appendChild(iframe);
    }

    // 5. تأخير التحميل (IntersectionObserver)
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
                }, { rootMargin: '800px 0px' });
            }
            slotElement._renderCallback = renderCallback;
            adObserver.observe(slotElement);
        } else {
            renderCallback();
        }
    }

    // 6. توزيع إعلانات المتن ونهاية الفصل
    function injectAdsIntoContainer(container) {
        if (!container || container.getAttribute('data-ads-injected') === 'true') return;
        container.setAttribute('data-ads-injected', 'true');

        var paragraphs = container.querySelectorAll('p.nsw-paragraph, p');
        var total = paragraphs.length;

        if (total >= 4) {
            var pos1 = Math.min(Math.floor(total * 0.33), 10);
            var box1 = createAdBox('A-Ads Banner (منتصف الفصل)');
            paragraphs[pos1].after(box1.slot);
            observeAd(box1.slot, function() {
                renderAAdsFrame(box1.content, CONFIG.bodyUnitId);
            });

            if (total >= 12) {
                var pos2 = Math.floor(total * 0.66);
                var box2 = createAdBox('A-Ads Banner (الجزء الثاني)');
                paragraphs[pos2].after(box2.slot);
                observeAd(box2.slot, function() {
                    renderAAdsFrame(box2.content, CONFIG.bodyUnitId);
                });
            }
        }

        var nav = container.querySelector('.nsw-chapter-nav') || document.querySelector('.nsw-chapter-nav');
        var transBox = createAdBox('A-Ads Banner (نهاية الفصل)');
        if (nav && nav.parentNode) {
            nav.parentNode.insertBefore(transBox.slot, nav);
        } else {
            container.appendChild(transBox.slot);
        }
        observeAd(transBox.slot, function() {
            renderAAdsFrame(transBox.content, CONFIG.bodyUnitId);
        });
    }

    // 7. إدارة الشريط العائم السفلي الذكي (الوحدة 2459346) مع مهلة 10 دقائق
    function initStickyAnchorBar() {
        if (document.getElementById('nsw-sticky-anchor')) return;

        var STORAGE_KEY = 'nsw_sticky_hide_until';
        var cooldownMs = (CONFIG.stickyCooldownMin || 10) * 60 * 1000;

        function isCooldownActive() {
            try {
                var until = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
                return Date.now() < until;
            } catch(e) {
                return false;
            }
        }

        var anchor = document.createElement('div');
        anchor.id = 'nsw-sticky-anchor';
        anchor.className = 'nsw-sticky-anchor-bar' + (isCooldownActive() ? ' nsw-sticky-hidden' : '');

        var closeTab = document.createElement('button');
        closeTab.className = 'nsw-sticky-close-tab';
        closeTab.setAttribute('aria-label', 'Close ad temporarily');
        closeTab.innerHTML = `
            <svg height="11px" width="11px" viewBox="0 0 490 490">
                <polygon points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490 489.292,457.678 277.331,245.004 489.292,32.337"/>
            </svg>
            <span>Close</span>
        `;

        var inner = document.createElement('div');
        inner.className = 'nsw-sticky-inner';

        anchor.appendChild(closeTab);
        anchor.appendChild(inner);
        document.body.appendChild(anchor);

        // حقن الإعلان في الشريط
        renderAAdsFrame(inner, CONFIG.stickyUnitId, '50px');

        // التعامل مع نقرة الإغلاق
        closeTab.addEventListener('click', function(e) {
            e.stopPropagation();
            anchor.classList.add('nsw-sticky-hidden');
            try {
                localStorage.setItem(STORAGE_KEY, (Date.now() + cooldownMs).toString());
            } catch(err) {}
        });

        // فحص دوري كل دقيقة لإعادة إظهار الشريط بعد انقضاء الـ 10 دقائق
        setInterval(function() {
            if (!isCooldownActive() && anchor.classList.contains('nsw-sticky-hidden')) {
                anchor.classList.remove('nsw-sticky-hidden');
            }
        }, 60000);
    }

    function init() {
        injectStyles();
        initStickyAnchorBar();

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
