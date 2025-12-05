import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ModernTopBar from '../../../components/common/TopBar/ModernTopBar';

const CheckoutSuccessPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (!sessionId) {
            navigate('/products');
        }
    }, [sessionId, navigate]);

    if (!sessionId) {
        return null;
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#F4F6F8' }}>
            <ModernTopBar title="Order Confirmed" />
            <Container maxWidth="sm" sx={{ py: 8 }}>
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                    <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                    <Typography variant="h4" gutterBottom>
                        Payment Successful!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        Thank you for your purchase. Your order has been confirmed and will be processed shortly.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                        Session ID: {sessionId}
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/products')}
                        fullWidth
                    >
                        Continue Shopping
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
};

export default CheckoutSuccessPage;
