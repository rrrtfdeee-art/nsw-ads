/**
 * Novelskyworld - Ad Manager (English Site)
 * Repository: rrrtfdeee-art/nsw-ads
 * Version: 1.2.0
 */
(function() {
    'use strict';

    var CONFIG = {
        site: 'en',
        reportUrl: 'https://en.novelskyworld.com/p/feedback.html',
        socialBarIntervalMin: 10,
        zones: {
            socialBar: {
                scriptUrl: 'https://pl28710870.profitableratecpmnetwork.com/74/a9/7a/74a97a6aac7a963afe4a3aebdca774b5.js'
            },
            nativeBanner: {
                containerId: 'container-737f706636a3452ed375e219fab12b06',
                scriptUrl: 'https://pl31940942.profitableratecpmnetwork.com/737f706636a3452ed375e219fab12b06/invoke.js'
            },
            banner728: {
                key: 'a4206aec18a5e232dba64b5be874ffc8',
                width: 728,
                height: 90,
                scriptUrl: 'https://www.highrevenueformat.com/a4206aec18a5e232dba64b5be874ffc8/invoke.js'
            }
        }
    };

    function isMobileDevice() {
        return window.innerWidth < 768;
    }

    function prepareAdReportData(adType, zoneId) {
        var base = CONFIG.reportUrl;
        var currentUrl = window.location.href;
        var novelEl = document.getElementById('dynamic-novel-name');
        var novel = novelEl ? novelEl.textContent.trim() : '';
        var headingEl = document.querySelector('#reading-content h1, .nsw-chapter-wrapper h1');
        var chapter = headingEl ? headingEl.textContent.trim() : (document.title || '');

        var reportPayload = {
            type: 'ad_report',
            ad_type: adType || 'Banner',
            zone_id: zoneId || '',
            novel: novel,
            chapter: chapter,
            page_url: currentUrl,
            timestamp: new Date().toLocaleString()
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

    function injectStyles() {
        if (document.getElementById('nsw-ad-styles-en')) return;
        var style = document.createElement('style');
        style.id = 'nsw-ad-styles-en';
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
                direction: ltr;
                font-family: inherit;
            }
            .nsw-ad-badge {
                font-weight: 600;
                color: var(--accent-gold, #c5a059);
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .nsw-ad-report-link,
            .nsw-ad-report-link:link,
            .nsw-ad-report-link:visited {
                color: var(--text-secondary, #888888) !important;
                text-decoration: underline !important;
                font-size: 11px !important;
                transition: color 0.2s ease;
                cursor: pointer;
            }
            .nsw-ad-report-link:hover,
            .nsw-ad-report-link:active {
                color: #e63946 !important;
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

    function initSocialBar() {
        var url = CONFIG.zones.socialBar.scriptUrl;
        if (!url) return;
        var STORAGE_KEY = 'nsw_last_socialbar_ts_en';
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
            <span class="nsw-ad-badge">✨ Sponsored Ad</span>
            <a href="${reportData.url}" target="_blank" rel="noopener noreferrer" class="nsw-ad-report-link">
                Report misleading or inappropriate ad
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
        var mobile = isMobileDevice();

        if (total >= 5) {
            var pos1 = Math.floor(total * 0.33);
            var box1 = createAdBox('Native Banner #1', CONFIG.zones.nativeBanner.containerId);
            paragraphs[pos1].after(box1.slot);
            observeAd(box1.slot, function() {
                renderNativeBanner(box1.content);
            });

            if (total >= 11) {
                var pos2 = Math.floor(total * 0.66);
                var box2 = createAdBox(mobile ? 'Native Banner #2' : 'Banner 728x90', mobile ? CONFIG.zones.nativeBanner.containerId : CONFIG.zones.banner728.key);
                paragraphs[pos2].after(box2.slot);
                observeAd(box2.slot, function() {
                    if (mobile) {
                        renderNativeBanner(box2.content);
                    } else {
                        renderBanner728(box2.content);
                    }
                });
            }
        }

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
