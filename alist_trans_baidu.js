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
    const API_URL = 'http://xxxxx/baidu';

    // 创建 UI 元素
    const container = document.createElement('div');
    container.id = 'linkSenderContainer';

    const icon = document.createElement('div');
    icon.id = 'linkSenderIcon';
    icon.textContent = '+'; // 或者使用一个 Font Awesome 图标

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'linkInput';
    input.placeholder = '请输入链接';
    input.style.display = 'none'; // 初始隐藏

    const button = document.createElement('button');
    button.textContent = '发送';
    button.id = 'linkSendButton';
    button.style.display = 'none'; // 初始隐藏

    container.appendChild(icon);
    container.appendChild(input);
    container.appendChild(button);
    document.body.appendChild(container);

    let isExpanded = false;

    // 图标点击事件
    icon.addEventListener('click', function() {
        isExpanded = !isExpanded;
        if (isExpanded) {
            input.style.display = 'block';
            button.style.display = 'block';
            icon.textContent = '-'; // 展开后改变图标
        } else {
            input.style.display = 'none';
            button.style.display = 'none';
            icon.textContent = '+'; // 收起后改变图标
        }
    });


    // 发送按钮点击事件
    button.addEventListener('click', function() {
        const link = input.value.trim();
        if (link) {
            sendLinkToAPI(link);
        } else {
            alert('请输入链接!');
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
    }

    // 添加 CSS 样式
    GM_addStyle(`
        #linkSenderContainer {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #f0f0f0;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 5px;
            z-index: 9999; /* 确保显示在最上层 */
            display: flex;
            flex-direction: column;
            align-items: center; /* 居中对齐 */
            gap: 5px;
        }

        #linkSenderIcon {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: #4CAF50;
            color: white;
            text-align: center;
            line-height: 30px;
            font-size: 20px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        #linkSenderIcon:hover {
            background-color: #3e8e41;
        }

        #linkInput {
            width: 200px;
            padding: 5px;
            border: 1px solid #ccc;
            border-radius: 3px;
        }

        #linkSendButton {
            padding: 5px 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        #linkSendButton:hover {
            background-color: #3e8e41;
        }
    `);

})();