// ==UserScript==
// @name         alist_trans_baidu
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在指定网站发送链接到API，点击图标展开
// @author       leioukupo
// @match        http://test.20010327.xyz/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // API 地址 (请替换成你的实际 API 地址)
    const API_URL = 'http://xxxxx/baidu';    // 创建 UI 元素
    const container = document.createElement('div');
    container.id = 'linkSenderContainer';

    const icon = document.createElement('div');
    icon.id = 'linkSenderIcon';
    
    // 创建百度网盘图标
    const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSvg.setAttribute('viewBox', '0 0 24 24');
    iconSvg.setAttribute('width', '24');
    iconSvg.setAttribute('height', '24');
    iconSvg.innerHTML = '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7v-2z"/>';
    
    icon.appendChild(iconSvg);

    const panel = document.createElement('div');
    panel.id = 'linkSenderPanel';
    panel.style.display = 'none'; // 初始隐藏

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'linkInput';
    input.placeholder = '输入百度分享链接';

    const button = document.createElement('button');
    button.textContent = '发送';
    button.id = 'linkSendButton';

    panel.appendChild(input);
    panel.appendChild(button);
    
    container.appendChild(icon);
    container.appendChild(panel);
    document.body.appendChild(container);    let isExpanded = false;

    // 图标点击事件
    icon.addEventListener('click', function() {
        togglePanel();
    });
    
    // 鼠标悬停事件
    icon.addEventListener('mouseenter', function() {
        if (!isExpanded) {
            togglePanel(true);
        }
    });
    
    // 鼠标离开事件
    container.addEventListener('mouseleave', function() {
        if (isExpanded) {
            togglePanel(false);
        }
    });
    
    // 切换面板显示/隐藏
    function togglePanel(forceState) {
        isExpanded = forceState !== undefined ? forceState : !isExpanded;
        
        if (isExpanded) {
            panel.style.display = 'flex';
            container.classList.add('expanded');
        } else {
            panel.style.display = 'none';
            container.classList.remove('expanded');
        }
    }
    // 发送按钮点击事件
    button.addEventListener('click', function() {
        const link = input.value.trim();
        if (link) {
            sendLinkToAPI(link);
        } else {
            alert('请输入百度分享链接!');
        }
    });

    // 发送链接到 API 的函数
    function sendLinkToAPI(link) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: API_URL,
            data: JSON.stringify({ link: link }), // 假设 API 接受 JSON 格式的数据
            headers: {
                'Content-Type': 'application/json',
                'Authorization':'leioukupo'
            },
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    alert('链接已成功发送!');
                    input.value = ''; // 清空输入框
                } else {
                    console.error('API 请求失败:', response);
                    alert('发送失败: ' + response.statusText);
                }
            },
            onerror: function(error) {
                console.error('API 请求错误:', error);
                alert('发送失败: 请求错误');
            }
        });
    }    // 添加 CSS 样式
    GM_addStyle(`
        #linkSenderContainer {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999; /* 确保显示在最上层 */
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            transition: all 0.3s ease;
        }
        
        #linkSenderContainer.expanded {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 12px;
        }

        #linkSenderIcon {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background-color: #2b89fb;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        
        #linkSenderIcon svg {
            fill: white;
        }

        #linkSenderIcon:hover {
            transform: scale(1.05);
            background-color: #1a73e8;
        }
        
        #linkSenderPanel {
            margin-top: 10px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 250px;
        }

        #linkInput {
            width: 100%;
            padding: 10px;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            font-size: 14px;
            outline: none;
            transition: border-color 0.3s;
            box-sizing: border-box;
        }

        #linkInput:focus {
            border-color: #2b89fb;
            box-shadow: 0 0 0 2px rgba(43, 137, 251, 0.2);
        }

        #linkSendButton {
            padding: 10px;
            background-color: #2b89fb;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
            font-weight: 500;
            text-align: center;
            width: 100%;
        }

        #linkSendButton:hover {
            background-color: #1a73e8;
        }
        
        #linkSendButton:active {
            background-color: #1669d9;
            transform: translateY(1px);
        }
    `);

})();