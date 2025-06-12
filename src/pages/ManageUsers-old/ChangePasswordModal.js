import React, { useState } from 'react';
import { Modal, Row, Col, Label, Button } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';

const ChangePasswordModal = ({ isOpen, toggle, selectedUser, onValidSubmit }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <Modal size="md" isOpen={isOpen} centered className="modal-dialog-scrollable" >
            <div className="modal-header">
                <h5 className="modal-title mt-0">Change Password</h5>
                <button onClick={toggle} type="button" className="btn-close" aria-label="Close" />
            </div>

            <Row className="px-3 py-2">
                <Col>
                    <Label>
                        {selectedUser?.email_id ? "Email ID" : "Phone Number"} :
                        <span className="ms-2">
                            {selectedUser?.email_id
                                ? selectedUser?.email_id
                                : `${selectedUser?.countrycode} ${selectedUser?.phone_number}`}
                        </span>
                    </Label>
                </Col>
            </Row>

            <AvForm className="form-horizontal px-3" onValidSubmit={onValidSubmit}>
                <div className="mt-3 input-group">
                    <div className="flex-grow-1">
                        <AvField
                            name="newpassword"
                            label="New Password"
                            className="form-control"
                            placeholder="Enter New Password"
                            type={showPassword ? "text" : "password"}
                            validate={{
                                required: {
                                    value: true,
                                    errorMessage: "Password is required",
                                },
                                minLength: {
                                    value: 8,
                                    errorMessage: "Password must be at least 8 characters long",
                                },
                                pattern: {
                                    value: /^(?=.*[A-Z]).+$/,
                                    errorMessage: "Password must contain at least one uppercase letter",
                                },
                            }}
                            required
                        />
                    </div>
                    <div style={{ marginLeft: '', padding: '3px 0px 4px 2px' }}>
                        <button style={{ border: '1px solid lightgrey', padding: '8px' }} onClick={() => setShowPassword(!showPassword)} className="btn btn-light mt-4" type="button" id="password-addon" >
                            <i className={showPassword ? "mdi mdi-eye-off" : "mdi mdi-eye-outline"} ></i>
                        </button>
                    </div>
                </div>

                <div className="mt-1 input-group">
                    <div className="flex-grow-1">
                        <AvField
                            name="confirmpassword"
                            label="Confirm Password"
                            className="form-control"
                            placeholder="Enter Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            validate={{
                                required: {
                                    value: true,
                                    errorMessage: "Confirm password is required",
                                },
                                match: {
                                    value: "newpassword",
                                    errorMessage: "Passwords do not match",
                                },
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginLeft: '', padding: '3px 0px 4px 2px' }}>
                        <button style={{ border: '1px solid lightgrey', padding: '8px' }} onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="btn btn-light mt-4" type="button" id="password-addon" >
                            <i className={showConfirmPassword ? "mdi mdi-eye-off" : "mdi mdi-eye-outline"} ></i>
                        </button>
                    </div>
                </div>

                <Row className="mb-3">
                    <Col xs={12} className="text-end">
                        <Button type="button" onClick={toggle} color="danger" size="sm" className="me-2 w-md"> Cancel </Button>
                        <Button type="submit" color="success" size="sm" className="me-2 w-md"> Change Password </Button>
                    </Col>
                </Row>
            </AvForm>
        </Modal>
    );
};

export default ChangePasswordModal;