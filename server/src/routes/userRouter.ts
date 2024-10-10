import { Router } from 'express';
import { registerUser,logincheck,userDetails } from '../controllers/auth';  
import { fetchItemDetails,addNewItems,editItem,deleteItem } from '../controllers/inventory';
import { addNewCustomer,editCustomer,fetchCustomerDetails,deleteCustomer } from '../controllers/customer';
import { fetchSales,recordSale } from '../controllers/sale';
import { fetchDashboardData } from '../controllers/dashboard';

const router = Router();

router.post('/signup',(req,res)=> registerUser(req,res));
router.post('/login',(req,res)=>logincheck(req,res))
router.post('/fetchUserDetails',(req,res)=>userDetails(req,res))
router.post('/inventory/fetchItems',(req,res)=>fetchItemDetails(req,res))
router.put('/inventory/addItems',(req,res)=>addNewItems(req,res))
router.put('/inventory/updateItem/:id',(req,res)=>editItem(req,res))
router.delete('/inventory/deleteItem/:id',(req,res)=>deleteItem(req,res))
router.post('/customers/addCustomer',(req,res)=>addNewCustomer(req,res))
router.put('/customers/updateCustomer/:id',(req,res)=>editCustomer(req,res))
router.post('/customers/fetchCustomers',(req,res)=>fetchCustomerDetails(req,res))
router.delete('/customers/deleteCustomer/:id',(req,res)=>deleteCustomer(req,res))
router.post('/fetchSales',(req,res)=>fetchSales(req,res))
router.post('/recordSales',(req,res)=>recordSale(req,res))
router.post('/dashboard/fetchDashboardData',(req,res)=>fetchDashboardData(req,res))


export default router;
