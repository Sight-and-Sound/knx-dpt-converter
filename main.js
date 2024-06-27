import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import knxLogo from '/knx.svg'
import {decode, encode} from "knx-datapoints"

import {Buffer} from "buffer/";  // note: the trailing slash is important!
window.Buffer = Buffer;

window.toHex = (buffer) => {
    return Array.prototype.map.call(buffer, x => ('00' + x.toString(16)).slice(-2)).join('');
}

window.getDptElement = () => document.querySelector('#dpt');
window.getFElement = () => document.querySelector('#fvalue');
window.getHElement = () => document.querySelector('#hvalue');
window.getRElement = () => document.querySelector('#rvalue');

window.updateDpt = () => {
    getFElement().value = '';
    getHElement().value = '';
};

window.updateFValue = (value) => {
    try {
        const encoded = encode(getDptElement().value, value);

        getHElement().value = toHex(encoded);
        updateRValue();
    } catch(e) {}
};

window.updateHValue = (value) => {
    try {
        const decoded = decode(getDptElement().value, Buffer.from(value.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))));

        getFElement().value = decoded;
        updateRValue();
    } catch(e) {}
};

window.updateRValue = () => {
    getRElement().value = getHElement().value.match(/.{1,2}/g)
        .map((byte) => parseInt(byte, 16))
        .map(nr => ('000' + nr.toString()).slice(-3))
        .join(' ');
}

document.querySelector('#app').innerHTML = `
<div>
    <a href="https://vitejs.dev" target="_blank">
        <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://knx.org" target="_blank">
        <img src="${knxLogo}" class="logo knx" alt="KNX logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
        <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <div class="card">
        <table>
            <thead>
                <tr>
                    <th>DPT</th>
                    <th>Formatted value</th>
                    <th>Raw hex value</th>
                    <th>Raw hex as decimals</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input type="text" id="dpt" oninput="updateDpt(this.value)" value="1.001"></td>
                    <td><input type="text" id="fvalue" oninput="updateFValue(this.value)" value="1"></td>
                    <td><input type="text" id="hvalue" oninput="updateHValue(this.value)"></td>
                    <td><input type="text" id="rvalue" disabled></td>
                </tr>
            </tbody>
        </table>
    </div>
    <p class="read-the-docs">Big thanks to Rafelder for bringing us the knx converter <a href="https://github.com/Rafelder">library</a>.</p>
</div>
`

updateFValue(getFElement().value);
