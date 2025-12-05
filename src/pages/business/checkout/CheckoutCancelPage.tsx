import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ModernTopBar from '../../../components/common/TopBar/ModernTopBar';

const CheckoutCancelPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#F4F6F8' }}>
            <ModernTopBar title="Payment Cancelled" />
            <Container maxWidth="sm" sx={{ py: 8 }}>
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                    <ErrorOutlineIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
                    <Typography variant="h4" gutterBottom>
                        Payment Cancelled
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        You have cancelled the payment process. No charges were made.
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/checkout')}
                        fullWidth
                        sx={{ mb: 2 }}
                    >
                        Return to Checkout
                    </Button>
                    <Button
                        variant="outlined"
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

export default CheckoutCancelPage;
