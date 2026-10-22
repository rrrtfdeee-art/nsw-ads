/**
 * Novelskyworld - Ad Manager (Arabic Site)
 * Repository: rrrtfdeee-art/nsw-ads
 * Version: 3.3.0 - Mondiad Clean Multi-Unit Integration (Smart Ad-Ready Synchronization)
 */
(function() {
    'use strict';

    // Early DNS prefetch & preconnect for Mondiad CDN
    try {
        ['https://ss.mrmnd.com'].forEach(function(orig) {
            var d = document.createElement('link'); d.rel = 'dns-prefetch'; d.href = orig; document.head.appendChild(d);
            var p = document.createElement('link'); p.rel = 'preconnect'; p.href = orig; p.crossOrigin = 'anonymous'; document.head.appendChild(p);
        });
    } catch(e) {}

    var CONFIG = {
        site: 'ar',
        reportUrl: 'https://www.novelskyworld.com/p/feedback.html',
        nativeZoneId: '870b4533-fc50-43b8-8bb7-4ea2a25aabdd',
        bannerZoneId: '2ddc0006-79d7-41ec-a73b-432952dcc7d0',
        inpageScriptUrl: 'https://ss.mrmnd.com/static/9885ff48-8886-4679-be2d-e7c929140470.js',
        inpageInitialDelaySec: 45,  // فترة تهدئة أولية 45 ثانية للزائر أول مرة
        inpageIntervalMin: 15,      // تكرار إعلان الاكس كل 15 دقيقة
        stickyCooldownMin: 10       // مهلة إغلاق الشريط السفلي 10 دقائق
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
            ad_type: adType || 'Mondiad Native',
            zone_id: zoneId || CONFIG.nativeZoneId,
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

    // 2. حقن الاستايل المتوافق مع الثيمات الملكية
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
            }

            /* مسافة أمان سفلية لضمان عدم حجب أي سطر من الرواية */
            #reading-content, .nsw-chapter-wrapper, #nsw-text-body, .actual-text {
                padding-bottom: 75px !important;
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
                box-sizing: border-box;
                display: none; /* يبدأ مخفياً تماماً حتى يكتمل تجهيز الإعلان */
                justify-content: center;
                align-items: center;
                animation: nswStickySlideUp 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
            @keyframes nswStickySlideUp {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
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
            @media (max-width: 767px) {
                .nsw-sticky-anchor-bar {
                    padding: 3px 4px;
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

    // 3. تحميل سكربتات Mondiad الخارجية مرة واحدة
    var scriptsLoaded = { native: false, banner: false };
    function loadMondiadScript(type) {
        if (type === 'native' && !scriptsLoaded.native) {
            scriptsLoaded.native = true;
            var s = document.createElement('script');
            s.async = true;
            s.src = 'https://ss.mrmnd.com/native.js';
            document.head.appendChild(s);
        } else if (type === 'banner' && !scriptsLoaded.banner) {
            scriptsLoaded.banner = true;
            var s = document.createElement('script');
            s.async = true;
            s.src = 'https://ss.mrmnd.com/banner.js';
            document.head.appendChild(s);
        }
    }

    // 4. بناء صندوق إعلان Native (جريدة الأخبار 81474)
    function createNativeBox(label) {
        var slot = document.createElement('div');
        slot.className = 'nsw-ad-slot';
        slot.setAttribute('data-ad-type', label);

        var card = document.createElement('div');
        card.className = 'nsw-ad-card';

        var reportData = prepareAdReportData(label, CONFIG.nativeZoneId);

        var header = document.createElement('div');
        header.className = 'nsw-ad-header';
        header.innerHTML = `
            <span class="nsw-ad-badge">✨ محتوى مدعوم</span>
            <a href="${reportData.url}" target="_blank" rel="noopener noreferrer" class="nsw-ad-report-link">
                هل يبدو الإعلان مضللاً أو مسيئاً؟ أبلغنا
            </a>
        `;

        var content = document.createElement('div');
        content.className = 'nsw-ad-content';

        var adTarget = document.createElement('div');
        adTarget.setAttribute('data-mndazid', CONFIG.nativeZoneId);
        content.appendChild(adTarget);

        card.appendChild(header);
        card.appendChild(content);
        slot.appendChild(card);

        return slot;
    }

    // 5. توزيع إعلانات Native داخل الفصل ونهايته
    function injectAdsIntoContainer(container) {
        if (!container || container.getAttribute('data-ads-injected') === 'true') return;
        container.setAttribute('data-ads-injected', 'true');

        var paragraphs = container.querySelectorAll('p.nsw-paragraph, p');
        var total = paragraphs.length;

        // إعلان داخل متن الفصل
        if (total >= 4) {
            var pos1 = Math.min(Math.floor(total * 0.4), 10);
            var box1 = createNativeBox('Mondiad Native (منتصف الفصل)');
            paragraphs[pos1].after(box1);
        }

        // إعلان نهاية الفصل قبل التنقل
        var nav = container.querySelector('.nsw-chapter-nav') || document.querySelector('.nsw-chapter-nav');
        var transBox = createNativeBox('Mondiad Native (نهاية الفصل)');
        if (nav && nav.parentNode) {
            nav.parentNode.insertBefore(transBox, nav);
        } else {
            container.appendChild(transBox);
        }

        loadMondiadScript('native');
    }

    // 6. إدارة الشريط العائم السفلي بمزامنة تامة (لا يظهر الشريط وزر الإغلاق إلا بعد حقن الإعلان فعلياً)
    function initStickyAnchorBar() {
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

        if (isCooldownActive()) {
            var remaining = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10) - Date.now();
            setTimeout(initStickyAnchorBar, Math.max(remaining, 5000));
            return;
        }

        if (document.getElementById('nsw-sticky-anchor')) return;

        var anchor = document.createElement('div');
        anchor.id = 'nsw-sticky-anchor';
        anchor.className = 'nsw-sticky-anchor-bar';
        anchor.style.display = 'none'; // بداية مخفية تماماً

        var closeTab = document.createElement('button');
        closeTab.className = 'nsw-sticky-close-tab';
        closeTab.setAttribute('aria-label', 'إغلاق الإعلان مؤقتاً');
        closeTab.innerHTML = `
            <svg height="11px" width="11px" viewBox="0 0 490 490">
                <polygon points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490 489.292,457.678 277.331,245.004 489.292,32.337"/>
            </svg>
            <span>إغلاق</span>
        `;

        var inner = document.createElement('div');
        inner.className = 'nsw-sticky-inner';

        var bannerDiv = document.createElement('div');
        bannerDiv.setAttribute('data-mndbanid', CONFIG.bannerZoneId);
        inner.appendChild(bannerDiv);

        anchor.appendChild(closeTab);
        anchor.appendChild(inner);
        document.body.appendChild(anchor);

        // مراقبة حقن إعلان Mondiad: إظهار الشريط وزر الإغلاق معاً فقط عند اكتمال الإعلان
        var isShown = false;
        function checkAndReveal() {
            if (isShown) return;
            if (bannerDiv.children.length > 0 || bannerDiv.querySelector('iframe, ins, img, a, div')) {
                isShown = true;
                anchor.style.display = 'flex';
                if (observer) observer.disconnect();
                clearInterval(poller);
            }
        }

        var observer = new MutationObserver(checkAndReveal);
        observer.observe(bannerDiv, { childList: true, subtree: true });

        // فحص دوري حتى 10 ثوانٍ كخطة بديلة
        var checkCount = 0;
        var poller = setInterval(function() {
            checkCount++;
            checkAndReveal();
            if (isShown || checkCount > 20) {
                clearInterval(poller);
                if (observer) observer.disconnect();
            }
        }, 500);

        loadMondiadScript('banner');

        closeTab.addEventListener('click', function(e) {
            e.stopPropagation();
            try {
                localStorage.setItem(STORAGE_KEY, (Date.now() + cooldownMs).toString());
            } catch(err) {}
            if (observer) observer.disconnect();
            clearInterval(poller);
            anchor.remove();
            setTimeout(initStickyAnchorBar, cooldownMs);
        });
    }

    // 7. إدارة إعلان الإكس الذكي (In-Page Push 81477) بتهدئة 15 دقيقة ومهلة أولية
    function initInPagePushManager() {
        var STORAGE_KEY_LAST = 'nsw_inpage_last_shown';
        var STORAGE_KEY_FIRST = 'nsw_visitor_first_seen';
        var intervalMs = (CONFIG.inpageIntervalMin || 15) * 60 * 1000;
        var initialDelayMs = (CONFIG.inpageInitialDelaySec || 45) * 1000;

        var now = Date.now();
        var firstSeen = localStorage.getItem(STORAGE_KEY_FIRST);
        if (!firstSeen) {
            localStorage.setItem(STORAGE_KEY_FIRST, now.toString());
            firstSeen = now;
        } else {
            firstSeen = parseInt(firstSeen, 10);
        }

        var lastShown = parseInt(localStorage.getItem(STORAGE_KEY_LAST) || '0', 10);

        function triggerInPagePush() {
            if (document.getElementById('nsw-inpage-push-script')) return;
            var script = document.createElement('script');
            script.id = 'nsw-inpage-push-script';
            script.async = true;
            script.src = CONFIG.inpageScriptUrl;
            document.head.appendChild(script);
            try {
                localStorage.setItem(STORAGE_KEY_LAST, Date.now().toString());
            } catch(e) {}
        }

        var timeSinceFirstSeen = now - firstSeen;
        var timeSinceLastShown = now - lastShown;

        if (lastShown === 0) {
            if (timeSinceFirstSeen < initialDelayMs) {
                setTimeout(triggerInPagePush, initialDelayMs - timeSinceFirstSeen);
            } else {
                setTimeout(triggerInPagePush, 10000);
            }
        } else {
            if (timeSinceLastShown >= intervalMs) {
                setTimeout(triggerInPagePush, 12000);
            } else {
                var remaining = intervalMs - timeSinceLastShown;
                setTimeout(triggerInPagePush, remaining);
            }
        }
    }

    function init() {
        injectStyles();
        initStickyAnchorBar();
        initInPagePushManager();

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