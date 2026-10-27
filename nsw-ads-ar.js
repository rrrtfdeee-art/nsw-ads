/**
 * Novelskyworld - Ad Manager (Arabic Site)
 * Repository: rrrtfdeee-art/nsw-ads
 * Version: 1.5.0 - Social Bar Killer Dismissal Guard (10-min strict cooldown)
 */
(function() {
    'use strict';

    // Early DNS prefetch & preconnect to eliminate ad SSL handshake delay
    try {
        ['https://bauval.org', 'https://www.highrevenueformat.com'].forEach(function(orig) {
            var d = document.createElement('link'); d.rel = 'dns-prefetch'; d.href = orig; document.head.appendChild(d);
            var p = document.createElement('link'); p.rel = 'preconnect'; p.href = orig; p.crossOrigin = 'anonymous'; document.head.appendChild(p);
        });
    } catch(e) {}

    var CONFIG = {
        site: 'ar',
        reportUrl: 'https://www.novelskyworld.com/p/feedback.html',
        socialBarIntervalMin: 10,
        zones: {
            socialBar: {
                scriptUrl: 'https://pl28362091.profitableratecpmnetwork.com/96/38/ef/9638ef90fde3d0ec9a45da53da3d2b32.js'
            },
            banner300: {
                key: '723aaf782f630eb06999d9b10006ec20',
                width: 300,
                height: 250,
                scriptUrl: 'https://bauval.org/22/723aaf782f630eb06999d9b10006ec20'
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

    // 1. توليد رابط إبلاغ ثلاثي الحماية (Query + Hash + LocalStorage)
    function prepareAdReportData(adType, zoneId) {
        var base = CONFIG.reportUrl;
        var currentUrl = window.location.href;
        var novelEl = document.getElementById('dynamic-novel-name');
        var novel = novelEl ? novelEl.textContent.trim() : '';
        var headingEl = document.querySelector('#reading-content h1, .nsw-chapter-wrapper h1');
        var chapter = headingEl ? headingEl.textContent.trim() : (document.title || '');

        var reportPayload = {
            type: 'ad_report',
            ad_type: adType || 'Banner 300x250',
            zone_id: zoneId || '',
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

    // 2. حقن الاستايل المتوافق مع الثيمات الخمسة
    function injectStyles() {
        if (document.getElementById('nsw-ad-styles')) return;
        var style = document.createElement('style');
        style.id = 'nsw-ad-styles';
        style.textContent = `
            .nsw-ad-slot {
                display: block;
                margin: 26px auto;
                text-align: center;
                max-width: 100%;
                clear: both;
            }
            .nsw-ad-card {
                display: inline-block;
                width: auto;
                max-width: 100%;
                padding: 10px 12px 10px;
                border-radius: 10px;
                box-sizing: border-box;
                position: relative;
                transition: background-color 0.3s ease, border-color 0.3s ease;
                background: rgba(125, 125, 125, 0.04);
                border: 1px dashed rgba(197, 160, 89, 0.35);
            }
            /* ثيمات الموقع */
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
                padding: 0 2px;
                color: var(--text-secondary, #888888);
                direction: rtl;
                font-family: inherit;
                gap: 12px;
            }
            .nsw-ad-badge {
                font-weight: 600;
                color: var(--accent-gold, #c5a059);
                display: flex;
                align-items: center;
                gap: 4px;
                white-space: nowrap;
            }
            .nsw-ad-report-link,
            .nsw-ad-report-link:link,
            .nsw-ad-report-link:visited {
                color: var(--text-secondary, #888888) !important;
                text-decoration: underline !important;
                font-size: 11px !important;
                transition: color 0.2s ease;
                cursor: pointer;
                white-space: nowrap;
            }
            .nsw-ad-report-link:hover,
            .nsw-ad-report-link:active {
                color: #e63946 !important;
            }
            .nsw-ad-content {
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }
            .nsw-ad-content iframe {
                border: 0;
                margin: 0 auto;
                display: block;
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);
    }

    // =========================================================================
    // 3. صائد الإغلاق الذكي وحارس السوشيال بار (Killer Dismissal Guard v2.0)
    // يسمح بظهور السوشيال بار مرة واحدة فقط كل 10 دقائق.
    // بمجرد إغلاقه أو انتهاء ظهوره الأول، يُعزل محرك أدستيرا بالكامل ويُمنع التكرار اللانهائي.
    // =========================================================================
    function initSocialBar() {
        var url = CONFIG.zones.socialBar ? CONFIG.zones.socialBar.scriptUrl : '';
        if (!url) return;

        var COOLDOWN_KEY = 'nsw_sbar_cooldown_until';
        var intervalMs = (CONFIG.socialBarIntervalMin || 10) * 60 * 1000; // 10 minutes
        var isSuppressed = false;
        var activeAdNode = null;
        var singleImpressionLoaded = false;

        function isCooldownActive() {
            try {
                var until = parseInt(localStorage.getItem(COOLDOWN_KEY) || '0', 10);
                return Date.now() < until;
            } catch(e) {
                return false;
            }
        }

        function setCooldown() {
            try {
                var until = Date.now() + intervalMs;
                localStorage.setItem(COOLDOWN_KEY, until.toString());
            } catch(e) {}
        }

        function injectShieldStyles() {
            if (document.getElementById('nsw-sbar-shield-css')) return;
            var st = document.createElement('style');
            st.id = 'nsw-sbar-shield-css';
            st.textContent = `
                body.nsw-sbar-blocked [class*="social-bar"],
                body.nsw-sbar-blocked [id*="dom3ic"],
                body.nsw-sbar-blocked [id*="pbpr0"],
                body.nsw-sbar-blocked [class*="_cepsocb"],
                body.nsw-sbar-blocked iframe[src*="profitableratecpmnetwork"] {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    pointer-events: none !important;
                    max-height: 0 !important;
                    max-width: 0 !important;
                    clip: rect(0, 0, 0, 0) !important;
                }
            `;
            document.head.appendChild(st);
        }

        function activateShield() {
            isSuppressed = true;
            document.body.classList.add('nsw-sbar-blocked');
            purgeAllAdsterraNodes();
            var scriptEl = document.getElementById('nsw-adsterra-sbar-script');
            if (scriptEl && scriptEl.parentNode) {
                scriptEl.parentNode.removeChild(scriptEl);
            }
        }

        function deactivateShield() {
            isSuppressed = false;
            singleImpressionLoaded = false;
            document.body.classList.remove('nsw-sbar-blocked');
        }

        function isAdsterraNode(node) {
            if (!node || node.nodeType !== 1) return false;
            var tag = (node.tagName || '').toLowerCase();
            var cls = (node.className && typeof node.className === 'string') ? node.className : '';
            var id = (node.id && typeof node.id === 'string') ? node.id : '';

            if (cls.indexOf('social-bar') !== -1 || cls.indexOf('_cepsocb') !== -1) return true;
            if (id.indexOf('dom3ic') !== -1 || id.indexOf('pbpr0') !== -1 || id.indexOf('s9ifs') !== -1) return true;

            if (tag === 'iframe') {
                var src = node.getAttribute('src') || '';
                if (src.indexOf('profitableratecpmnetwork') !== -1) return true;
                var st = node.getAttribute('style') || '';
                if (st.indexOf('fixed') !== -1 && (st.indexOf('214748364') !== -1 || st.indexOf('z-index') !== -1)) return true;
            }

            if (tag === 'div') {
                var stDiv = node.getAttribute('style') || '';
                if (stDiv.indexOf('fixed') !== -1) {
                    if (node.querySelector && node.querySelector('iframe[src*="profitableratecpmnetwork"], [class*="social-bar"], [id*="dom3ic"]')) {
                        return true;
                    }
                }
            }
            return false;
        }

        function purgeAllAdsterraNodes() {
            var targets = document.querySelectorAll('[class*="social-bar"], [id*="dom3ic"], [id*="pbpr0"], [class*="_cepsocb"], iframe[src*="profitableratecpmnetwork"]');
            for (var i = 0; i < targets.length; i++) {
                try {
                    targets[i].style.setProperty('display', 'none', 'important');
                    targets[i].style.setProperty('opacity', '0', 'important');
                    if (targets[i].parentNode) targets[i].parentNode.removeChild(targets[i]);
                } catch(e) {}
            }
        }

        function armDismissalGuard(container) {
            if (!container || activeAdNode === container) return;
            activeAdNode = container;

            // إمساك أي نقرة إغلاق أو تفاعل عبر Capture Phase
            var onInteraction = function(e) {
                // إذا تم النقر على زر الإغلاق أو أي عنصر تفاعلي داخل الحاوية
                setTimeout(function() {
                    setCooldown();
                    activateShield();
                }, 120);
            };

            container.addEventListener('click', onInteraction, true);
            container.addEventListener('touchend', onInteraction, true);

            // صمام أمان زمني: بعد 30 ثانية من الظهور الأول، يتم تفعيل المهلة وعزل التكرار
            setTimeout(function() {
                if (!isCooldownActive()) {
                    setCooldown();
                }
                activateShield();
            }, 30000);
        }

        // مراقب الـ DOM لرصد حاوية أدستيرا وحمايتها من التكرار اللانهائي
        var guardObserver = new MutationObserver(function(mutations) {
            for (var m = 0; m < mutations.length; m++) {
                var added = mutations[m].addedNodes;
                for (var n = 0; n < added.length; n++) {
                    var node = added[n];
                    if (isAdsterraNode(node)) {
                        if (isSuppressed || isCooldownActive() || singleImpressionLoaded) {
                            // منع الإعلان الثاني والثالث وحذفهم فوراً
                            try {
                                node.style.setProperty('display', 'none', 'important');
                                if (node.parentNode) node.parentNode.removeChild(node);
                            } catch(e) {}
                        } else {
                            // السماح بالظهور الأول فقط
                            singleImpressionLoaded = true;
                            armDismissalGuard(node);
                        }
                    }
                }
            }
        });

        injectShieldStyles();
        guardObserver.observe(document.documentElement || document.body, { childList: true, subtree: true });

        // التحقق الأولي: إذا كانت فترة الـ 10 دقائق نشطة، نمنع التحميل فوراً
        if (isCooldownActive()) {
            activateShield();
            return;
        }

        // إطلاق الظهور الأول لمرة واحدة
        function triggerSingleImpression() {
            if (isCooldownActive()) return;
            deactivateShield();
            var s = document.createElement('script');
            s.id = 'nsw-adsterra-sbar-script';
            s.type = 'text/javascript';
            s.src = url;
            document.body.appendChild(s);
        }

        triggerSingleImpression();

        // فحص دوري كل دقيقة للتأكد مما إذا انتهت فترة الـ 10 دقائق
        setInterval(function() {
            if (!isCooldownActive() && isSuppressed) {
                deactivateShield();
                triggerSingleImpression();
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

        var reportData = prepareAdReportData(type, zoneId);

        var header = document.createElement('div');
        header.className = 'nsw-ad-header';
        header.innerHTML = `
            <span class="nsw-ad-badge">✨ إعلان مدعوم</span>
            <a href="${reportData.url}" target="_blank" rel="noopener noreferrer" class="nsw-ad-report-link">
                هل يبدو الإعلان مضللاً أو مسيئاً؟ أبلغنا
            </a>
        `;

        var linkEl = header.querySelector('.nsw-ad-report-link');
        if (linkEl) {
            linkEl.addEventListener('click', function() {
                try {
                    localStorage.setItem('nsw_pending_ad_report', JSON.stringify(reportData.payload));
                } catch(e) {}
            });
        }

        var content = document.createElement('div');
        content.className = 'nsw-ad-content';

        card.appendChild(header);
        card.appendChild(content);
        slot.appendChild(card);

        return { slot: slot, content: content };
    }

    // 5. حقن إعلان Banner 300x250 (المقاس النظيف الفردي للهاتف والكمبيوتر)
    function renderBanner300(targetEl) {
        var b = CONFIG.zones.banner300;
        var iframe = document.createElement('iframe');
        iframe.width = '300';
        iframe.height = '250';
        iframe.style.width = '300px';
        iframe.style.height = '250px';
        iframe.style.maxWidth = '100%';
        iframe.scrolling = 'no';
        iframe.style.border = '0';
        iframe.style.overflow = 'hidden';
        targetEl.appendChild(iframe);

        try {
            var doc = iframe.contentWindow.document;
            doc.open();
            doc.write('<!DOCTYPE html><html><head><base target="_blank"><style>body{margin:0;padding:0;overflow:hidden;display:flex;justify-content:center;align-items:center;background:transparent;}</style></head><body>' +
                '<script type="text/javascript">' +
                'atOptions = {' +
                "  'key' : '" + b.key + "'," +
                "  'format' : 'iframe'," +
                "  'height' : 250," +
                "  'width' : 300," +
                "  'params' : {}" +
                '};' +
                '<\/script>' +
                '<script type="text/javascript" src="' + b.scriptUrl + '"><\/script>' +
                '</body></html>');
            doc.close();
        } catch(e) {}
    }

    // 6. حقن Banner 728x90 للكمبيوتر فقط
    function renderBanner728(targetEl) {
        var b = CONFIG.zones.banner728;
        var iframe = document.createElement('iframe');
        iframe.width = '728';
        iframe.height = '90';
        iframe.style.width = '728px';
        iframe.style.height = '90px';
        iframe.style.maxWidth = '100%';
        iframe.scrolling = 'no';
        iframe.style.border = '0';
        iframe.style.overflow = 'hidden';
        targetEl.appendChild(iframe);

        try {
            var doc = iframe.contentWindow.document;
            doc.open();
            doc.write('<!DOCTYPE html><html><head><base target="_blank"><style>body{margin:0;padding:0;overflow:hidden;display:flex;justify-content:center;align-items:center;background:transparent;}</style></head><body>' +
                '<script type="text/javascript">' +
                'atOptions = {' +
                "  'key' : '" + b.key + "'," +
                "  'format' : 'iframe'," +
                "  'height' : 90," +
                "  'width' : 728," +
                "  'params' : {}" +
                '};' +
                '<\/script>' +
                '<script type="text/javascript" src="' + b.scriptUrl + '"><\/script>' +
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
                }, { rootMargin: '800px 0px' });
            }
            slotElement._renderCallback = renderCallback;
            adObserver.observe(slotElement);
        } else {
            renderCallback();
        }
    }

    // 8. توزيع الإعلانات الاحترافي والنظيف
    function injectAdsIntoContainer(container) {
        if (!container || container.getAttribute('data-ads-injected') === 'true') return;
        container.setAttribute('data-ads-injected', 'true');

        var paragraphs = Array.from(container.querySelectorAll('.nsw-paragraph, p')).filter(function(p) {
            return !p.closest('.nsw-ad-slot') && (p.textContent || '').trim().length > 15;
        });

        var total = paragraphs.length;
        var mobile = isMobileDevice();

        if (mobile) {
            // للهاتف: لافتة 300x250 نظيفة واحدة (أو اثنتان إذا كان الفصل طويلاً جداً)
            if (total >= 4) {
                var posMid = Math.floor(total * 0.5);
                var boxM1 = createAdBox('Banner 300x250', CONFIG.zones.banner300.key);
                paragraphs[posMid].after(boxM1.slot);
                observeAd(boxM1.slot, function() {
                    renderBanner300(boxM1.content);
                });
            }

            // إعلان نظيف 300x250 قبل أزرار التنقل (نهاية الفصل)
            var navM = container.querySelector('.nsw-chapter-nav') || document.querySelector('.nsw-chapter-nav');
            var transBoxM = createAdBox('Banner 300x250 (نهاية الفصل)', CONFIG.zones.banner300.key);
            if (navM && navM.parentNode) {
                navM.parentNode.insertBefore(transBoxM.slot, navM);
            } else {
                container.appendChild(transBoxM.slot);
            }
            observeAd(transBoxM.slot, function() {
                renderBanner300(transBoxM.content);
            });
            return;
        }

        // للكمبيوتر: لافتات 728x90 و 300x250 الأنيقة
        if (total >= 5) {
            var pos1 = Math.floor(total * 0.33);
            var box1 = createAdBox('Banner 728x90', CONFIG.zones.banner728.key);
            paragraphs[pos1].after(box1.slot);
            observeAd(box1.slot, function() {
                renderBanner728(box1.content);
            });

            if (total >= 11) {
                var pos2 = Math.floor(total * 0.66);
                var box2 = createAdBox('Banner 300x250', CONFIG.zones.banner300.key);
                paragraphs[pos2].after(box2.slot);
                observeAd(box2.slot, function() {
                    renderBanner300(box2.content);
                });
            }
        }

        var nav = container.querySelector('.nsw-chapter-nav') || document.querySelector('.nsw-chapter-nav');
        var transBox = createAdBox('Banner 728x90 (نهاية الفصل)', CONFIG.zones.banner728.key);
        if (nav && nav.parentNode) {
            nav.parentNode.insertBefore(transBox.slot, nav);
        } else {
            container.appendChild(transBox.slot);
        }
        observeAd(transBox.slot, function() {
            renderBanner728(transBox.content);
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
