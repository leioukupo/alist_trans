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
    const API_URL = 'http://x.x.x.x:5962/baidu';
    // 创建 UI 元素
    const container = document.createElement('div');
    container.id = 'linkSenderContainer';
    const icon = document.createElement('div');
    icon.id = 'linkSenderIcon';// 创建加号图标
    const plusIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    plusIcon.setAttribute('viewBox', '0 0 24 24');
    plusIcon.setAttribute('width', '24');
    plusIcon.setAttribute('height', '24');
    plusIcon.setAttribute('class', 'plus-icon');
    plusIcon.innerHTML = `
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        <!-- 四等分的断续圆弧 - 调整位置更靠外 -->
        <path d="M12 1C14 1 16 1.5 17.8 2.4 19.5 3.2 21 4.5 22 6" fill="none" stroke="white" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M23 12C23 14 22.5 16 21.6 17.8 20.8 19.5 19.5 21 18 22" fill="none" stroke="white" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M12 23C10 23 8 22.5 6.2 21.6 4.5 20.8 3 19.5 2 18" fill="none" stroke="white" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M1 12C1 10 1.5 8 2.4 6.2 3.2 4.5 4.5 3 6 2" fill="none" stroke="white" stroke-width="1.2" stroke-linecap="round"/>
    `;

    // 创建减号图标
    const minusIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    minusIcon.setAttribute('viewBox', '0 0 24 24');
    minusIcon.setAttribute('width', '24');
    minusIcon.setAttribute('height', '24');
    minusIcon.setAttribute('class', 'minus-icon');
    minusIcon.style.display = 'none'; // 初始隐藏减号
    minusIcon.innerHTML = `
        <path d="M19 13H5v-2h14v2z"/>
        <!-- 四等分的断续圆弧 - 调整位置更靠外 -->
        <path d="M12 1C14 1 16 1.5 17.8 2.4 19.5 3.2 21 4.5 22 6" fill="none" stroke="white" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M23 12C23 14 22.5 16 21.6 17.8 20.8 19.5 19.5 21 18 22" fill="none" stroke="white" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M12 23C10 23 8 22.5 6.2 21.6 4.5 20.8 3 19.5 2 18" fill="none" stroke="white" stroke-width="1.2" stroke-linecap="round"/>
        <path d="M1 12C1 10 1.5 8 2.4 6.2 3.2 4.5 4.5 3 6 2" fill="none" stroke="white" stroke-width="1.2" stroke-linecap="round"/>
    `;

    icon.appendChild(plusIcon);
    icon.appendChild(minusIcon);

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
    document.body.appendChild(container);
    let isExpanded = false;
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
            document.querySelector('.plus-icon').style.display = 'none';
            document.querySelector('.minus-icon').style.display = 'block';
        } else {
            panel.style.display = 'none';
            container.classList.remove('expanded');
            document.querySelector('.plus-icon').style.display = 'block';
            document.querySelector('.minus-icon').style.display = 'none';
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
                'Authorization':'xxxxxxx'
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
    }
    // 添加 CSS 样式
    GM_addStyle(`
        #linkSenderContainer {
            position: fixed;
            top: 52px;
            right: 5px;
            z-index: 9999; /* 确保显示在最上层 */
            display: flex;
            flex-direction: column;
            align-items: flex-end;            transition: all 0.3s ease;
            user-select: none; /* 防止文本选择 */
        }

        #linkSenderContainer.expanded {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 12px;
        }        #linkSenderIcon {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background-color: #2b89fb;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer; /* 改为普通指针 */
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }

        #linkSenderIcon svg {
            fill: white;
            width: 28px;
            height: 28px;
        }

        .plus-icon, .minus-icon {
            display: block;
        }

        .plus-icon path, .minus-icon path {
            stroke-dasharray: 0;
            transition: stroke-dasharray 0.3s;
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