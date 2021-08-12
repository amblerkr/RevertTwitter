// ==UserScript==
// @name         트위터 설정
// @namespace    http://tampermonkey.net/
// @version      1
// @description  트위터의 기본 폰트를 원하는 폰트로 변경하고 팔로우 버튼을 파랑색으로 변경합니다.
// @author       Ambler
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @grant        none
// ==/UserScript==

var font = 'Noto Sans CJK KR';

(function() {
    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '* { font-family: \'' + font + '\' !important; }';
    head.appendChild(style);
})()


const init = () => {
    console.log(`"${GM_info.script.name}" is Ready!`);

    const get_follow_buttons = () => {
        return [...document.querySelectorAll('div')].filter(div => {
            const aria_label = div.getAttribute('aria-label');
            if (aria_label === null) return false;

            const is_button = div.getAttribute('role') === 'button';
            const contain_follow = aria_label.match(/팔로(.*)? @/) !== null;
            const contain_span = [...div.querySelectorAll('span')].filter(span => span.childElementCount === 1 && span.innerText === '팔로우').length > 0;
            return is_button && contain_follow;
        });
    }

    const update_styles = (follow_buttons) => {
        for (const button of follow_buttons) {
            const is_follow = button.innerText === '팔로우';
            button.style.background = is_follow ? 'rgba(0, 0, 0, 0)' : 'rgb(29, 161, 242)';
            button.style.border = is_follow ? 'solid 1px rgb(29, 161, 242)' : 'none';
            const span = button.querySelector('span');
            span.style.color = is_follow ? 'rgb(29, 161, 242)' : 'white';
            button.classList[is_follow ? 'remove' : 'add']('bring-back-button');
        }
    }

    const main = () => {
        update_styles(get_follow_buttons());
        requestAnimationFrame(main);
    }

    const css = '.bring-back-button:hover { background: rgb(220, 30, 41) !important; }';
    const custom_style = document.createElement('style');
    custom_style.appendChild(document.createTextNode(css));
    document.head.appendChild(custom_style);
    main();
}

onload = () => setTimeout(init, 1500);
