import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import ExpenseTable from './ExpenseTable';
import ExpenseDetails from './ExpenseDetails';
import ExpenseForm from './ExpenseForm';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [incomeAmt, setIncomeAmt] = useState(0);
    const [expenseAmt, setExpenseAmt] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        setTimeout(() => navigate('/login'), 1000);
    };

    useEffect(() => {
        const amounts = expenses.map(item => item.amount);
        const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0);
        const exp = amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1;

        setIncomeAmt(income);
        setExpenseAmt(exp);
    }, [expenses]);

    const deleteExpense = async (id) => {
        try {
            const url = `${APIUrl}/expenses/${id}`;
            const options = {
                method: "DELETE",
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            };
            const response = await fetch(url, options);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            const result = await response.json();
            handleSuccess(result?.message);
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    };

    const fetchExpenses = useCallback(async () => {
        try {
            const url = `${APIUrl}/expenses`;
            const options = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            };
            const response = await fetch(url, options);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            const result = await response.json();
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    }, [navigate]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    const addTransaction = async (data) => {
        try {
            const url = `${APIUrl}/expenses`;
            const options = {
                method: "POST",
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            };
            const response = await fetch(url, options);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            const result = await response.json();
            handleSuccess(result?.message);
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    };

    return (
        <div>
            <div className='user-section'>
                <h1>Welcome {loggedInUser}</h1>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <ExpenseDetails incomeAmt={incomeAmt} expenseAmt={expenseAmt} />
            <ExpenseForm addTransaction={addTransaction} />
            <br/><br /> <br /> 
            <ExpenseTable expenses={expenses} deleteExpense={deleteExpense} />
            <ToastContainer />
        </div>
    );
}

export default Home;
