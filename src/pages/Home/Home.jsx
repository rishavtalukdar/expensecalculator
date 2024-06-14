import { useEffect, useState } from "react";
import Card from "../../Component/Card/Card.jsx";
import styles from "./Home.module.css";
import TransactionList from "../../Component/TransactionList/TransactionList.jsx";
import ExpenseForm from "../../Component/Forms/ExpenseForm/ExpenseForm.jsx";
import Modal from "../../Component/Modal/Modal.jsx";
import AddBalanceForm from "../../Component/Forms/AddBalanceForm/AddBalanceForm.jsx";
import PieChart from "../../Component/PieChart/PieChart.jsx";
import BarChart from "../../Component/BarChart/BarChart.jsx";

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [expenseList, setExpenseList] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  //Show hide modals
  const [isOpenExpense, setIsOpenExpense] = useState(false);
  const [isOpenBalance, setIsOpenBalance] = useState(false);

  const [categorySpends, setCategorySpends] = useState({
    food: 0,
    entertainment: 0,
    travel: 0,
  });
   
  const expense =expenseList.reduce(
    (accumulator, currentValue) =>
      accumulator + Number(currentValue.price),
    0
  )
  console.log("expense",expense)
 
  useEffect(() => {
    //Check localStorage
    const localBalance = localStorage.getItem("balance");

    if (localBalance) {
      setBalance(Number(localBalance));
    } else {
      setBalance(5000);
      localStorage.setItem("balance", 5000);
    }

    const items = JSON.parse(localStorage.getItem("expenses"));

    setExpenseList(items || []);
    setIsMounted(true);
  }, []);

  // saving expense list in localStorage
  useEffect(() => {
    if (expenseList.length > 0 || isMounted) {
      localStorage.setItem("expenses", JSON.stringify(expenseList));
    }

    let foodSpends = 0,
      entertainmentSpends = 0,
      travelSpends = 0;


    expenseList.forEach((item) => {
      if (item.category === "food") {
        foodSpends += Number(item.price);
        
      } else if (item.category === "entertainment") {
        entertainmentSpends += Number(item.price);
        
      } else if (item.category === "travel") {
        travelSpends += Number(item.price);

      }
    });

    setCategorySpends({
      food: foodSpends,
      travel: travelSpends,
      entertainment: entertainmentSpends,
    });
  }, [expenseList]);

  // saving balance in localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("balance", balance);
    }
  }, [balance]);

  return (
    <div className={styles.container}>
      <h1>Expense Tracker</h1>

      {/* Cards and pie chart wrapper */}

      <div className={styles.cardsWrapper}>
        <Card
          title="Wallet Balance"
          money={balance}
          buttonText="+ Add Income"
          buttonType="success"
          handleClick={() => {
            setIsOpenBalance(true);
          }}
        />
        
        <Card
          title="Expenses"
          money={expense}
          buttonText="+ Add Expense"
          buttonType="failure"
          success={false}
          handleClick={() => {
            setIsOpenExpense(true);
          }}
        />

        <PieChart
          data={[
            { name: "Food", value: categorySpends.food },
            { name: "Entertainment", value: categorySpends.entertainment },
            { name: "Travel", value: categorySpends.travel },
          ].filter(obj=>obj.value)}
        />
      </div>

      {/* Transactions and bar chart wrapper */}
      <div className={styles.transactionsWrapper}>
        <TransactionList
          transactions={expenseList}
          editTransactions={setExpenseList}
          title="Recent Transactions"
          balance={balance}
          setBalance={setBalance}
        />

        <BarChart
          data={[
            { name: "Food", value: categorySpends.food },
            { name: "Entertainment", value: categorySpends.entertainment },
            { name: "Travel", value: categorySpends.travel },
          ]}
        />
      </div>

      {/* Modals */}
      <Modal isOpen={isOpenExpense} setIsOpen={setIsOpenExpense}>
        <ExpenseForm
          setIsOpen={setIsOpenExpense}
          expenseList={expenseList}
          setExpenseList={setExpenseList}
          setBalance={setBalance}
          balance={balance}
        />
      </Modal>

      <Modal isOpen={isOpenBalance} setIsOpen={setIsOpenBalance}>
        <AddBalanceForm setIsOpen={setIsOpenBalance} setBalance={setBalance} />
      </Modal>
    </div>
  );
}
