import React from 'react'

function ExpenseDetails({ incomeAmt, expenseAmt }) {
    return (
        <div>
           <h4>if you add expense use "-" before enter amount</h4>
           <br /> 
            <div>
              <h2 > Your Balance is ₹ {incomeAmt - expenseAmt}</h2>
            </div>
            {/* Show Income & Expense amount */}
            <div className="amounts-container">
                Income
                <span className="income-amount">₹{incomeAmt}</span>
                Expense
                <span className="expense-amount">₹{expenseAmt}</span>
            </div>
        </div>
    )
}

export default ExpenseDetails