/**
 * Novelskyworld - Ad Manager (Arabic Site)
 * Repository: rrrtfdeee-art/nsw-ads
 * CDN: https://cdn.jsdelivr.net/gh/rrrtfdeee-art/nsw-ads@main/nsw-ads-ar.js
 */
(function() {
    'use strict';

    var CONFIG = {
        site: 'ar',
        reportUrl: 'https://www.novelskyworld.com/p/feedback.html',
        socialBarIntervalMin: 10,
        zones: {
            socialBar: {
                scriptUrl: 'https://pl28362091.profitableratecpmnetwork.com/96/38/ef/9638ef90fde3d0ec9a45da53da3d2b32.js'
            },
            nativeBanner: {
                containerId: 'container-f06e3c2f42596de54854e5df61c3e5a9',
                scriptUrl: 'https://pl28362097.profitableratecpmnetwork.com/f06e3c2f42596de54854e5df61c3e5a9/invoke.js'
            },
            banner728: {
                key: 'c8631902860268441842b82bec7d1375',
                width: 728,
                height: 90,
                scriptUrl: 'https://www.highrevenueformat.com/c8631902860268441842b82bec7d1375/invoke.js'
            }
        }
    };

    function isMobileDevice() {
        return window.innerWidth < 768;
    }

    // 1. توليد رابط إبلاغ مخصص ومملوء ببيانات الإعلان والفصل
    function getCustomReportUrl(adType, zoneId) {
        try {
            var base = CONFIG.reportUrl;
            var currentUrl = window.location.href;
            var novelEl = document.getElementById('dynamic-novel-name');
            var novel = novelEl ? novelEl.textContent.trim() : '';
            var headingEl = document.querySelector('#reading-content h1, .nsw-chapter-wrapper h1');
            var chapter = headingEl ? headingEl.textContent.trim() : (document.title || '');

            var query = '?type=ad_report' +
                '&ad_type=' + encodeURIComponent(adType || 'Banner') +
                '&zone_id=' + encodeURIComponent(zoneId || '') +
                '&novel=' + encodeURIComponent(novel) +
                '&chapter=' + encodeURIComponent(chapter) +
                '&page_url=' + encodeURIComponent(currentUrl);

            return base + query;
        } catch(e) {
            return CONFIG.reportUrl;
        }
    }

    // 2. استايل متوافق مع الثيمات الخمسة وشاشات الهواتف
    function injectStyles() {
        if (document.getElementById('nsw-ad-styles')) return;
        var style = document.createElement('style');
        style.id = 'nsw-ad-styles';
        style.textContent = `
            .nsw-ad-slot {
                display: block;
                margin: 24px auto;
                text-align: center;
                max-width: 100%;
                clear: both;
            }
            .nsw-ad-card {
                display: inline-block;
                width: 100%;
                max-width: 760px;
                padding: 10px 10px 8px;
                border-radius: 10px;
                box-sizing: border-box;
                position: relative;
                transition: background-color 0.3s ease, border-color 0.3s ease;
                background: rgba(125, 125, 125, 0.04);
                border: 1px dashed rgba(197, 160, 89, 0.35);
            }
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
                font-family: inherit;
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
                width: 100%;
                overflow-x: auto;
                overflow-y: hidden;
                -webkit-overflow-scrolling: touch;
            }
            .nsw-ad-content iframe {
                border: 0;
                margin: 0 auto;
                display: block;
                width: 100%;
            }
        `;
        document.head.appendChild(style);
    }

    // 3. إدارة Social Bar كل 10 دقائق
    function initSocialBar() {
        var url = CONFIG.zones.socialBar.scriptUrl;
        if (!url) return;
        var STORAGE_KEY = 'nsw_last_socialbar_ts';
        var intervalMs = (CONFIG.socialBarIntervalMin || 10) * 60 * 1000;

        function trigger() {
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = url;
            document.body.appendChild(s);
            localStorage.setItem(STORAGE_KEY, Date.now().toString());
        }

        var last = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
        var now = Date.now();
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

    // 4. بناء حاوية الإعلان
    function createAdBox(type, zoneId) {
        var slot = document.createElement('div');
        slot.className = 'nsw-ad-slot';
        slot.setAttribute('data-ad-type', type);

        var card = document.createElement('div');
        card.className = 'nsw-ad-card';

        var reportUrl = getCustomReportUrl(type, zoneId);

        var header = document.createElement('div');
        header.className = 'nsw-ad-header';
        header.innerHTML = `
            <span class="nsw-ad-badge">✨ إعلان مدعوم</span>
            <a href="${reportUrl}" target="_blank" rel="noopener noreferrer" class="nsw-ad-report-link">
                هل يبدو الإعلان مضللاً أو مسيئاً؟ أبلغنا
            </a>
        `;

        var content = document.createElement('div');
        content.className = 'nsw-ad-content';

        card.appendChild(header);
        card.appendChild(content);
        slot.appendChild(card);

        return { slot: slot, content: content };
    }

    // 5. حقن Banner 728x90 للكمبيوتر فقط
    function renderBanner728(targetEl) {
        var b = CONFIG.zones.banner728;
        var iframe = document.createElement('iframe');
        iframe.width = b.width.toString();
        iframe.height = b.height.toString();
        iframe.style.width = b.width + 'px';
        iframe.style.height = b.height + 'px';
        iframe.style.maxWidth = '100%';
        iframe.scrolling = 'no';
        targetEl.appendChild(iframe);

        try {
            var doc = iframe.contentWindow.document;
            doc.open();
            doc.write('<!DOCTYPE html><html><head><base target="_blank"><style>body{margin:0;padding:0;overflow:hidden;display:flex;justify-content:center;align-items:center;background:transparent;}</style></head><body>' +
                '<script type="text/javascript">' +
                'atOptions = {' +
                "  'key' : '" + b.key + "'," +
                "  'format' : 'iframe'," +
                "  'height' : " + b.height + "," +
                "  'width' : " + b.width + "," +
                "  'params' : {}" +
                '};' +
                '<\/script>' +
                '<script type="text/javascript" src="' + b.scriptUrl + '"><\/script>' +
                '</body></html>');
            doc.close();
        } catch(e) {}
    }

    // 6. حقن Native Banner (على الهاتف يظهر إعلان 1 فقط، وعلى الكمبيوتر تظهر الـ 4 إعلانات أفقياً)
    function renderNativeBanner(targetEl) {
        var n = CONFIG.zones.nativeBanner;
        var iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = isMobileDevice() ? '260px' : '170px';
        iframe.scrolling = 'no';
        targetEl.appendChild(iframe);

        try {
            var doc = iframe.contentWindow.document;
            doc.open();
            doc.write('<!DOCTYPE html><html><head><base target="_blank">' +
                '<style>' +
                'body{margin:0;padding:0;background:transparent;font-family:sans-serif;overflow:hidden;}' +
                /* كود CSS لعزل الإعلانات الزائدة على شاشات الهاتف */
                '@media (max-width: 768px) {' +
                '  [id^="container-"] > *:nth-child(n+2), ' +
                '  [id^="container-"] > * > *:nth-child(n+2) { display: none !important; }' +
                '}' +
                '</style></head><body>' +
                '<script async="async" data-cfasync="false" src="' + n.scriptUrl + '"><\/script>' +
                '<div id="' + n.containerId + '"></div>' +
                '<script>' +
                'var isMobile = (window.parent && window.parent.innerWidth < 768) || (window.innerWidth < 768);' +
                'var attempts = 0;' +
                'var checkAd = setInterval(function() {' +
                '  attempts++;' +
                '  var cont = document.getElementById("' + n.containerId + '");' +
                '  if (cont && cont.children.length > 0) {' +
                '    if (isMobile) {' +
                '      var ch = Array.from(cont.children);' +
                '      if (ch.length > 1) {' +
                '        for (var i = 1; i < ch.length; i++) { ch[i].style.setProperty("display", "none", "important"); }' +
                '      } else if (ch.length === 1 && ch[0].children.length > 1) {' +
                '        var sub = Array.from(ch[0].children);' +
                '        for (var j = 1; j < sub.length; j++) { sub[j].style.setProperty("display", "none", "important"); }' +
                '      }' +
                '    }' +
                '    var h = document.body.scrollHeight;' +
                '    if (h > 40) {' +
                '      window.frameElement.style.height = (h + 8) + "px";' +
                '      if (attempts > 5) clearInterval(checkAd);' +
                '    }' +
                '  }' +
                '  if (attempts > 30) clearInterval(checkAd);' +
                '}, 250);' +
                '<\/script>' +
                '</body></html>');
            doc.close();
        } catch(e) {}
    }

    // 7. تأخير التحميل (IntersectionObserver)
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

    // 8. توزيع الإعلانات الذكي: إعلان واحد فقط للهاتف، والتوزيع الكامل للكمبيوتر
    function injectAdsIntoContainer(container) {
        if (!container || container.getAttribute('data-ads-injected') === 'true') return;
        container.setAttribute('data-ads-injected', 'true');

        var paragraphs = Array.from(container.querySelectorAll('.nsw-paragraph, p')).filter(function(p) {
            return !p.closest('.nsw-ad-slot') && (p.textContent || '').trim().length > 15;
        });

        var total = paragraphs.length;
        var mobile = isMobileDevice();

        if (mobile) {
            // للهاتف: نكتفي بإعلان Native واحد فقط داخل الفصل في المنتصف تماماً (يعرض إعلاناً واحداً فقط)
            if (total >= 4) {
                var midPos = Math.floor(total * 0.5);
                var mBox = createAdBox('Native Banner', CONFIG.zones.nativeBanner.containerId);
                paragraphs[midPos].after(mBox.slot);
                observeAd(mBox.slot, function() {
                    renderNativeBanner(mBox.content);
                });
            } else {
                var navEl = container.querySelector('.nsw-chapter-nav') || document.querySelector('.nsw-chapter-nav');
                var mBox2 = createAdBox('Native Banner', CONFIG.zones.nativeBanner.containerId);
                if (navEl && navEl.parentNode) navEl.parentNode.insertBefore(mBox2.slot, navEl);
                else container.appendChild(mBox2.slot);
                observeAd(mBox2.slot, function() {
                    renderNativeBanner(mBox2.content);
                });
            }
            return; // إنهاء التوزيع للهاتف (إعلان واحد فقط بالمجمل)
        }

        // للكمبيوتر والشاشات الكبيرة: التوزيع الكامل
        if (total >= 5) {
            // إعلان 1: Native Banner بعد ثلث الفصل (يظهر أفقياً 4 بطاقات)
            var pos1 = Math.floor(total * 0.33);
            var box1 = createAdBox('Native Banner', CONFIG.zones.nativeBanner.containerId);
            paragraphs[pos1].after(box1.slot);
            observeAd(box1.slot, function() {
                renderNativeBanner(box1.content);
            });

            // إعلان 2: Banner 728x90 بعد ثلثي الفصل
            if (total >= 12) {
                var pos2 = Math.floor(total * 0.68);
                var box2 = createAdBox('Banner 728x90', CONFIG.zones.banner728.key);
                paragraphs[pos2].after(box2.slot);
                observeAd(box2.slot, function() {
                    renderBanner728(box2.content);
                });
            }
        }

        // إعلان 3: قبل التنقل بنهاية الفصل
        var nav = container.querySelector('.nsw-chapter-nav') || document.querySelector('.nsw-chapter-nav');
        var transBox = createAdBox('Native Banner (Transition)', CONFIG.zones.nativeBanner.containerId);
        if (nav && nav.parentNode) {
            nav.parentNode.insertBefore(transBox.slot, nav);
        } else {
            container.appendChild(transBox.slot);
        }
        observeAd(transBox.slot, function() {
            renderNativeBanner(transBox.content);
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
