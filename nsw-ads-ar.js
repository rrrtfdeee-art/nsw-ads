/**
 * Novelskyworld - Ad Manager (Arabic Site)
 * Repository: rrrtfdeee-art/nsw-ads
 * Version: 2.0.0 - Clean A-Ads (Privacy-focused, 0 Malware/Popups)
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
        site: 'ar',
        reportUrl: 'https://www.novelskyworld.com/p/feedback.html',
        aadsUnitId: '2459344',
        aadsSrc: 'https://acceptable.a-ads.com/2459344/?size=Adaptive'
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
            ad_type: adType || 'A-Ads Banner (Adaptive)',
            zone_id: zoneId || CONFIG.aadsUnitId,
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

    // 2. حقن الاستايل المتوافق مع الثيمات
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
        `;
        document.head.appendChild(style);
    }

    // 3. بناء صندوق الإعلان
    function createAdBox(label) {
        var slot = document.createElement('div');
        slot.className = 'nsw-ad-slot';
        slot.setAttribute('data-ad-type', label);

        var card = document.createElement('div');
        card.className = 'nsw-ad-card';

        var reportData = prepareAdReportData(label, CONFIG.aadsUnitId);

        var header = document.createElement('div');
        header.className = 'nsw-ad-header';
        header.innerHTML = `
            <span class="nsw-ad-badge">✨ إعلان مدعوم</span>
            <a href="${reportData.url}" target="_blank" rel="noopener noreferrer" class="nsw-ad-report-link">
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

    // 4. حقن البنر المتجاوب A-Ads
    function renderAAdsBanner(targetEl) {
        var iframe = document.createElement('iframe');
        iframe.setAttribute('data-aa', CONFIG.aadsUnitId);
        iframe.src = CONFIG.aadsSrc;
        iframe.style.border = '0';
        iframe.style.padding = '0';
        iframe.style.width = '100%';
        iframe.style.height = 'auto';
        iframe.style.minHeight = isMobileDevice() ? '100px' : '90px';
        iframe.style.overflow = 'hidden';
        iframe.style.display = 'block';
        iframe.style.margin = 'auto';
        iframe.scrolling = 'no';
        targetEl.appendChild(iframe);
    }

    // 5. تأخير التحميل (IntersectionObserver 800px)
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

    // 6. توزيع الإعلانات الذكي والنظيف
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
                renderAAdsBanner(box1.content);
            });

            if (total >= 12) {
                var pos2 = Math.floor(total * 0.66);
                var box2 = createAdBox('A-Ads Banner (الجزء الثاني)');
                paragraphs[pos2].after(box2.slot);
                observeAd(box2.slot, function() {
                    renderAAdsBanner(box2.content);
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
            renderAAdsBanner(transBox.content);
        });
    }

    function init() {
        injectStyles();

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
