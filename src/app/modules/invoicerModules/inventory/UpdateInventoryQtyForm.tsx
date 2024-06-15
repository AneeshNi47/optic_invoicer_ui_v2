import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import {Modal} from 'react-bootstrap'
import * as Yup from 'yup';
import { useAuth } from '../../auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { checkSubscription } from '../invoices/_requests';
import { SubscriptionResponse } from '../invoices/_models';
import { updateInventoryQty } from './_requests';
import { useCombinedContext } from '../CombinedProvider';

interface UpdateInventoryQtyProps {
    show: boolean
    handleClose: () => void
    modalContent: any
    // Add additional props as required
}

const UpdateInventoryQtyForm: React.FC<UpdateInventoryQtyProps> = ({ 
    show,
    handleClose,
    modalContent /*, other props */,
  }) => {
  const { setShouldFetchInventory } = useCombinedContext();
  const { auth } = useAuth();
  const initialValues = {
    qty: 0,
  };
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionResponse | any>({});
  const [createInvoicePermission, setCreateInvoicePermission] = useState(false);

  const validationSchema = Yup.object({
    qty: Yup.number().min(0, 'Must be greater than or equal to 0').required('Required'),
  });

  useEffect(() => {
    if (auth?.token) {
      const fetchApi = async () => {
        try {
          const responseData = await checkSubscription(auth.token);
          setSubscriptionDetails(responseData.data);
          setCreateInvoicePermission(responseData.data.create_invoice_permission);
        } catch (error) {
          console.error('Error fetching API', error);
        }
      };

      fetchApi();
    }
  }, [auth?.token]);

  const handleSubmit = async (values: { qty: number }) => {
    if (auth?.token && createInvoicePermission) {
      try {
        const response = await updateInventoryQty(auth?.token, modalContent.id, values);

        if (response.status === 200) {
          toast.success('Inventory quantity updated successfully');
          setShouldFetchInventory(true);
          handleClose();
        } else {
          toast.error('Unable to update Inventory quantity');
          handleClose();
        }
      } catch (error: any) {
        console.error('Error updating inventory quantity:', error);
        toast.error(error.response.data.error);
        handleClose();
      }
    }
  };

  return (
    <>
    <Modal
      className='modal fade'
      id='kt_modal_update_qty'
      data-backdrop='static'
      tabIndex={-1}
      role='dialog'
      show={show}
      dialogClassName='modal-l'
      aria-hidden='true'
      onHide={handleClose}
      // ... other modal props
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h2 className='text-danger'>Update Stock for {modalContent.name}</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className='row'>
            <div className='form-group col-md-12'>
              <label htmlFor='qty'>Quantity:</label>
              <Field type='number' name='qty' className='form-control my-2' />
              <ErrorMessage name='qty' component='div' className='error-message' />
            </div>
          </div>

          <div className='row mt-12'>
            <div className='form-group col-md-12 d-flex justify-content-center'>
              <button disabled={!createInvoicePermission} type='submit' className='btn btn-primary'>
                Submit
              </button>
            </div>
            {!createInvoicePermission && (
              <div className='form-group col-md-12 text-center mt-2'>
                <span className='text-danger'>
                  Your {subscriptionDetails ? subscriptionDetails.subscription_type : '-'}{' '}
                  subscription has ended, please contact the administrator to update Inventory.
                </span>
              </div>
            )}
          </div>
        </Form>
      </Formik>
      </Modal.Body>
    </Modal>
    </>
  );
};

export default UpdateInventoryQtyForm;
