import { LitElement, html, css } from 'https://cdn.skypack.dev/lit';
import axios from 'https://cdn.skypack.dev/axios';

async function getWidgetById(API_BASE_URL, widgetId) {
  try {
    const response = await axios.get(
      API_BASE_URL + '/live-chat/widget/' + widgetId
    );

    if (response.data.payload) return response.data.payload;
    else return null;
  } catch (error) {
    return Promise.reject(error);
  }
}

class QLiveChatWidget extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      font-family: Arial, sans-serif;
    }
    .chat-container {
      width: 350px;
      height: 500px;
      display: flex;
      flex-direction: column;
      background: var(--chat-bg, white);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      overflow: hidden;
      transform: scale(0);
      transition: transform 0.3s ease-in-out;
    }
    .open .chat-container {
      transform: scale(1);
    }
    .header {
      background: var(--chat-header, #0078ff);
      color: white;
      padding: 10px;
      text-align: center;
      font-weight: bold;
      cursor: pointer;
    }
    .conversations {
      flex: 1;
      padding: 10px;
      overflow-y: auto;
    }
    .input-box {
      display: flex;
      border-top: 1px solid #ddd;
    }
    input {
      flex: 1;
      padding: 10px;
      border: none;
      outline: none;
    }
    button {
      padding: 10px;
      background: var(--chat-button, #0078ff);
      color: white;
      border: none;
      cursor: pointer;
    }
    .chat-button {
      background: var(--chat-button, #0078ff);
      color: white;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      position: absolute;
      bottom: 0;
      right: 0;
    }
  `;

  static properties = {
    widgetId: { type: String },
    API_BASE_URL: { type: String },
    profile: { type: Object },
    open: { type: Boolean },

    // widget: { type: Object },
    messages: { type: Array },
    conversations: { type: Array },
  };

  constructor() {
    super();
    this.conversations = [];
    // this.socket = new WebSocket('wss://your-chat-server.com'); // Ganti dengan servermu

    // this.socket.addEventListener('message', (event) => {
    //   this.conversations = [...this.conversations, { text: event.data, sender: 'bot' }];
    //   this.requestUpdate();
    // });
  }

  firstUpdated() {
    this.init();
  }

  async init() {
    const resWidget = await getWidgetById(this.API_BASE_URL, this.widgetId);
    console.info('resWidget', resWidget);
    this.widget = resWidget;
    this.requestUpdate();
  }

  toggleChat() {
    this.open = !this.open;
  }

  // sendMessage() {
  //   const input = this.shadowRoot.querySelector('input');
  //   const message = input.value.trim();
  //   if (!message) return;

  //   this.conversations = [
  //     ...this.conversations,
  //     { text: message, sender: 'user' },
  //   ];
  //   this.socket.send(message);
  //   input.value = '';
  //   this.requestUpdate();
  // }

  render() {
    return html`
      <div class="chat-button" @click=${this.toggleChat}>💬</div>
      <div class="${this.open ? 'open' : ''}">
        <div class="chat-container">
          <div class="header" @click=${this.toggleChat}>
            Live Chat ${this.widget?.partnerId ? ' - ' + this.widget?.partnerId : ''}
          </div>
          <div class="conversations">
            ${this.conversations.map(
              (msg) =>
                html`<div>
                  <b>${msg.sender === 'user' ? 'You' : 'CS'}:</b> ${msg.text}
                </div>`
            )}
          </div>
          <div class="input-box">
            <input
              type="text"
              placeholder="Ketik pesan..."
              @keypress=${(e) => e.key === 'Enter' && this.sendMessage()}
            />
            <button @click=${this.sendMessage}>Kirim</button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('q-live-chat-widget', QLiveChatWidget);
