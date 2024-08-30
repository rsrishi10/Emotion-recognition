import React, { useState } from 'react';
import { Container, Button, Table, Row, Col, Form, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import styles from './home.module.css'; 

const Home = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [emotions, setEmotions] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setVideoFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!videoFile) {
            setError("No video file selected.");
            return;
        }

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', videoFile);

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/upload-video`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("Response received:", response.data);
            setEmotions(response.data.emotions);
        } catch (error) {
            console.error('Error uploading video:', error);
            setError('Error uploading video.');
        } finally {
            setUploading(false);
        }
    };

    
    const getTopEmotions = (emotionData) => {
        if (!emotionData || Object.keys(emotionData).length === 0) return [];
        const sortedEmotions = Object.entries(emotionData).sort((a, b) => b[1] - a[1]);
        return sortedEmotions.slice(0, 3);
    };

    return (
        <Container className="mt-4">
            <Row>
                <Col md={12}>
                    <h2 className="text-center mb-4">Emotion Detection</h2>
                    <Card className={`p-4 ${styles.card}`}>
                        <Form.Group controlId="formFile" className="mb-3 text-start">
                            <Form.Label>Upload a video to analyse:</Form.Label>
                            <Form.Control type="file" accept="video/*" onChange={handleFileChange} />
                        </Form.Group>
                        <div className={styles.buttonWrapper}>
                            <Button
                                variant="primary"
                                onClick={handleUpload}
                                className={`mt-2 ${styles.uploadButton}`}
                                disabled={uploading}
                            >
                                {uploading ? 'Analyzing...' : 'Analyse uploaded video'}
                            </Button>
                        </div>
                        {error && <Alert variant="danger" className={styles.errorAlert}>{error}</Alert>}
                    </Card>

                    {emotions.length > 0 && (
                        <>
                            <h5 className={`${styles.detectedEmotionsTitle}`}>Detected Emotions</h5>

                            <Card.Body className={styles.tableBody}>
                                <div className="text-start">
                                    <Table bordered className={styles.tableHeader}>
                                        <thead>
                                            <tr>
                                                <th>Frame Time(s)</th>
                                                <th>Emotions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {emotions.map((emotionData, index) => {
                                                const topEmotions = getTopEmotions(emotionData.emotions);
                                                return (
                                                    <tr key={index}>
                                                        <td>{emotionData.frame_time}</td>
                                                        <td>
                                                            <div className={styles.emotionContainer}>
                                                                {Object.entries(emotionData.emotions).map(([emotion, confidence], i) => (
                                                                    <div
                                                                        key={i}
                                                                        className={`${styles.emotionRow} ${topEmotions.some(([e]) => e === emotion) ? styles.highlighted : ''}`}
                                                                    >
                                                                        <span className={styles.emotionLabel}><strong>{emotion}:</strong></span>
                                                                        <span className={styles.emotionConfidence}>{confidence}%</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                </div>
                            </Card.Body>
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Home;
