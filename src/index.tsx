import "config/global.less";

import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {ConfigProvider} from "antd";
import zhCN from "antd/es/locale/zh_CN";

import RootPage from "@@/index.tsx";

function App() {
    return (
        <ConfigProvider locale={zhCN} componentSize={"small"}>
            <RootPage />
        </ConfigProvider>
    );
}

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
    , document.getElementById("root")
);
