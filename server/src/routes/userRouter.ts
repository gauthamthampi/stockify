import { Router } from 'express';
import { registerUser,logincheck,userDetails } from '../controllers/auth';  
import { fetchItemDetails,addNewItems } from '../controllers/inventory';

const router = Router();

router.post('/signup',(req,res)=> registerUser(req,res));
router.post('/login',(req,res)=>logincheck(req,res))
router.post('/fetchUserDetails',(req,res)=>userDetails(req,res))
router.post('/inventory/fetchItems',(req,res)=>fetchItemDetails(req,res))
router.put('/inventory/addItems',(req,res)=>addNewItems(req,res))


export default router;
