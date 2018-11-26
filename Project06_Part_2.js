/**
 *   @author Lee Marshall (marshalll@student.ncmich.edu)
 *   @version 0.0.1
 *   @summary
 *   @todo Nothing
 */

"use strict";
const PROMPT = require('readline-sync');
const IO = require('fs');
const EMP_ID = 0,  LAST_NAME = 2,FIRST_NAME = 1, ADDRESS = 3, HOURLY_RATE = 4, CUST_ID = 0, HOURS = 5;


let continueResponse;
let action;
let employees = [], customers = [], weeklyTrans = [];


function main(){
    loadEmployees();
    loadCustomers();
    transGenerator();/*Creates the weekly data for where and how much employees work, only for demonstration, would not be in real prg.
    If real prog, transGenerator would be replaced with menu functions to add/remove clients & employees. Would also have ability to
    save employee & customer data. Sense updating the master file wasn't a requirement I decided to simplify things even though this
    function resembles a plate of spaghetti*/
    sortTransOrder();
    calculateHours();
    if (continueResponse !== 0 && continueResponse !== 1) {
        setContinueResponse();
    }
    console.log(`\x1Bc`);
    while (continueResponse === 0) {
        chooseAction();
        switch (action) {
            case 1: listAllTrans();
                break;
            case 2: buildFullReport();
                break;
            case 3: buildWorkingReport();
                break;
            case 4: continueResponse = 1;
                break;
        }
        setContinueResponse();
    }
}
main();

function chooseAction() {
    //console.log(`\x1Bc`);
    action = -1;
    while (action !== 1 && action !== 2 && action !== 3 && action !== 4){
        action = Number(PROMPT.question(
            `\n\tWhat would you like to do?
            1) View all transactions
            2) View all employees weekly job report
            3) View only employees who have worked this week
            4) Quit & End week
            Please enter value: `));
    }
}

function listAllTrans() {
    console.log(`\x1Bc`);
    console.log(`Employee #\tJob #\tHours worked\tHourly rate\tGross pay\n==========      =====   ============    ===========     =========`);
    for (let i = 0; i < weeklyTrans.length; i++) {
        let paid = weeklyTrans[i][HOURS] * weeklyTrans[i][HOURLY_RATE];
        process.stdout.write(` ${i + 1}) ${weeklyTrans[i][EMP_ID]}\t${weeklyTrans[i][LAST_NAME]}\t  ${weeklyTrans[i][HOURS]}\t\t${weeklyTrans[i][HOURLY_RATE]} \t\t${paid}\n`);
    }
}

function buildWorkingReport() {
    console.log(`\x1Bc`);
    console.log(`Employee #\tHours worked\tHourly rate\tGross pay\n==========      ============    ===========     =========`);
    let num = 0;
    for (let i = 0; i < employees.length; i++) {
        if (employees[i][HOURS] !== 0) {
            let paid = employees[i][HOURS] * employees[i][HOURLY_RATE];
            process.stdout.write(` ${num + 1}) ${employees[i][EMP_ID]}   \t  ${employees[i][HOURS]}\t\t${employees[i][HOURLY_RATE]} \t\t${paid}\n`);
            num++;
        }
    }
}

function calculateHours() {
    let longest;
    if (weeklyTrans < employees){
        longest = employees.length;
    } else {
        longest = weeklyTrans.length;
    }
    let j = 0;
    for (let i = 0; i < longest; i++){
        if (employees[j][EMP_ID] === weeklyTrans[i][EMP_ID]){
            employees[j][HOURS] = employees[j][HOURS] + weeklyTrans[i][HOURS]
        }else {
            j++;
            i--;
        }
    }
}

function buildFullReport() {
    console.log(`\x1Bc`);
    console.log(`Employee #\tHours worked\tHourly rate\tGross pay\n==========      ============    ===========     =========`);
    for (let i = 0; i < employees.length; i++) {
        let paid = employees[i][HOURS] * employees[i][HOURLY_RATE];
        process.stdout.write(` ${i + 1}) ${employees[i][EMP_ID]}   \t  ${employees[i][HOURS]}\t\t${employees[i][HOURLY_RATE]} \t\t${paid}\n`);
    }
}

function sortTransOrder(){
    let temp;
    let swap = 1;
    let lim = weeklyTrans.length;
    while (swap === 1) {
        let i = 0;
        if (i < lim) {
            swap = 0;
            for (let j = 0; j < lim - i - 1; j++) {
                if (weeklyTrans[j][EMP_ID] > weeklyTrans[j + 1][EMP_ID]) {
                    temp = weeklyTrans[j];
                    weeklyTrans[j] = weeklyTrans[j + 1];
                    weeklyTrans[j + 1] = temp;
                    swap = 1;
                }
            }
            i++;
        }
    }
}

function loadEmployees() {
    let employeeFiles = IO.readFileSync(`data/employee_data.csv`, 'utf8');
    let lines = employeeFiles.toString().split(/\r?\n/); // Automatically creates SD array on newlines
    for (let i = 0; i < lines.length; i++) {
        employees.push(lines[i].toString().split(/,/)); // Makes array MD by pushing data between commas
    }
    for (let i = 0;i < employees.length; i++){
        employees[i][EMP_ID] = Number(employees[i][EMP_ID]);
        employees[i][HOURLY_RATE] = Number(employees[i][HOURLY_RATE]);
        employees[i][HOURS] = 0;
    }
}

function loadCustomers(){
    let customerFiles = IO.readFileSync(`data/customer_data.csv`, 'utf8');
    let lines = customerFiles.toString().split(/\r?\n/); // Automatically creates SD array on newlines
    for (let i = 0; i < lines.length; i++) {
        customers.push(lines[i].toString().split(/,/)); // Makes array MD by pushing data between commas
    }
}

function setContinueResponse() {
    if (continueResponse) {
        continueResponse = -1;
        while (continueResponse !== 0 && continueResponse !== 1) {
            continueResponse = Number(PROMPT.question(`\nAre you sure you want to quit? [0=no, 1=yes]: `));
        }
    } else {
        continueResponse = 0;
    }
}

function transGenerator() {//only for demonstration
    const MAX_TRANS = 7;
    let checked = [];
    for (let a = 0; a < employees.length; a++){//for loop creates MD array for tempEmp
        checked[a] = [];
    }
    let hours, tempCust, tempEmp;
    for (let i = 0; i < MAX_TRANS; i++) {
        tempEmp = Math.floor(Math.random() * (employees.length));//sets random employee
        let onlyOnce = false;
        while (! onlyOnce) {//loops random customer until employee does not have duplicate job
            onlyOnce = true;
            tempCust = Math.floor(Math.random() * (customers.length));//sets random customer
            if (checked[tempEmp].length === customers.length){//checks that employee has not worked all jobs
                tempEmp = Math.floor(Math.random() * (employees.length));//resets random employee if set employee has work all available jobs one time
            }
            for (let ckcust of checked[tempEmp]) {//this for loop and if statement check that employee has not worked this job this week
                if (ckcust === tempCust) {
                    onlyOnce = false;
                    break;
                }
            }
            if (onlyOnce) {
                checked[tempEmp].push(tempCust);
                break;
            }
        }
        hours = Math.floor((Math.random() * 40) + 1);//set HOURS from 1 to 40
        weeklyTrans[i] = [];
        weeklyTrans[i][EMP_ID] = Number(employees[tempEmp][EMP_ID]);
        weeklyTrans[i][LAST_NAME] = Number(customers[tempCust][CUST_ID]);
        weeklyTrans[i][FIRST_NAME] = customers[tempCust][FIRST_NAME];
        weeklyTrans[i][ADDRESS] = customers[tempCust][ADDRESS];
        weeklyTrans[i][HOURLY_RATE] = Number(employees[tempEmp][HOURLY_RATE]);
        weeklyTrans[i][HOURS] = Number(hours);
    }
}