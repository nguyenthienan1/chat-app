import React from 'react'
import { Row, Col, Button, Typography } from "antd";
import SideBar from './SideBar';
import ChatWindow from './ChatWindow';

export default function ChatRoom() {
    return (
        <div>
            <Row>
                <Col span={6}> <SideBar /> </Col>
                <Col span={18}><ChatWindow /></Col>
            </Row>
        </div>
    )
}
