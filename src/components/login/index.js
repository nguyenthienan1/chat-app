import React from "react";
import { Row, Col, Button, Typography } from "antd";
import firebase, { auth, db } from "../../firebase/config"
import { useNavigate } from "react-router-dom";
import { addDocument, generateKeywords } from "../../firebase/services";


const { Title } = Typography;

export default function Login() {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    const navigate = useNavigate();

    const handleGooleLogin = async () => {
        await firebase.auth().signInWithPopup(googleProvider)
            .then((result) => {
                const user = result.user;
                const additionalUserInfo = result.additionalUserInfo;

                if (additionalUserInfo.isNewUser) {
                    addDocument('users', {
                        displayName: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL,
                        uid: user.uid,
                        providerId: additionalUserInfo.providerId,
                        keywords: generateKeywords(user.displayName?.toLowerCase()),
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div>
            <Row justify="center" style={{ height: 800 }}>
                <Col span={8}>
                    <Title style={{ textAlign: "center" }} level={3}>
                        Chat
                    </Title>
                    <Button style={{ width: "100%", marginBottom: 5 }} onClick={handleGooleLogin}>
                        Đăng nhập bằng Google
                    </Button>
                </Col>
            </Row>
        </div>
    );
}
