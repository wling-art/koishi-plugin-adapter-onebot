# koishi-plugin-adapter-onebot

> 本项目基于 [koishijs/koishi-plugin-adapter-onebot](https://github.com/koishijs/koishi-plugin-adapter-onebot) fork，<br>
> 用于优化和补充原仓库功能，便于后续维护和更新。

适用于 [Koishi](https://koishi.chat/) 的 OneBot 适配器。

[OneBot](https://github.com/howmanybots/onebot) 是一个聊天机器人应用接口标准。

## 配置项

### config.protocol

- 可选值: http, ws, ws-reverse

要使用的协议类型。

### config.token

- 类型：`string`

发送信息时用于验证的字段。

### config.endpoint

- 类型：`string`

如果使用了 HTTP，则该配置将作为发送信息的服务端；如果使用了 WebSocket，则该配置将作为监听事件和发送信息的服务端。

### config.proxyAgent

- 类型: `string`
- 默认值: [`app.config.request.proxyAgent`](https://koishi.chat/zh-CN/api/core/app.html#options-request-proxyagent)

请求时默认使用的网络代理。

### config.path

- 类型：`string`
- 默认值：`'/onebot'`

服务器监听的路径。仅用于 HTTP 或 WS Reverse 通信方式。

### config.secret

- 类型：`string`

接收信息时用于验证的字段，应与 OneBot 的 `secret` 配置保持一致。

## 内部 API

你可以通过 `bot.internal` 或 `session.onebot` 访问内部 API，参见 [访问内部接口](https://koishi.chat/zh-CN/guide/adapter/bot.html#internal-access)。

## 许可证

使用 [MIT](./LICENSE) 许可证发布。

```
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
