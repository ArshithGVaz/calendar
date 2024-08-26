import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPage = () => {
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email_id: '',
        employee_id: '',
        phone_number: '',
        manager: '',
        manager_id: ''
    });
    const [editingId, setEditingId] = useState(null);

    // Fetch Employees
    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:8000/employees/');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`http://localhost:8000/employees/${editingId}`, formData);
            } else {
                await axios.post('http://localhost:8000/employees/', formData);
            }
            fetchEmployees();
            setFormData({
                name: '',
                email_id: '',
                employee_id: '',
                phone_number: '',
                manager: '',
                manager_id: ''
            });
            setEditingId(null);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleEdit = (employee) => {
        setFormData({ ...employee });
        setEditingId(employee.id);
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({
            name: '',
            email_id: '',
            employee_id: '',
            phone_number: '',
            manager: '',
            manager_id: ''
        });
    };

    // Placeholder for authentication check (to be implemented based on your auth setup)
    const isAuthenticated = () => {
        return localStorage.getItem('authToken'); // Just a placeholder
    };

    if (!isAuthenticated()) {
        return <div>You are not authorized to view this page</div>;
    }

    return (
        <div className="admin-page">
            <h1>Employee Management</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} />
                <input type="text" name="email_id" placeholder="Email ID" value={formData.email_id} onChange={handleInputChange} />
                <input type="text" name="employee_id" placeholder="Employee ID" value={formData.employee_id} onChange={handleInputChange} />
                <input type="text" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleInputChange} />
                <input type="text" name="manager" placeholder="Manager" value={formData.manager} onChange={handleInputChange} />
                <input type="text" name="manager_id" placeholder="Manager ID" value={formData.manager_id} onChange={handleInputChange} />
                <button type="submit">{editingId ? 'Update' : 'Add'}</button>
                {editingId && <button onClick={handleCancel}>Cancel</button>}
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email ID</th>
                        <th>Employee ID</th>
                        <th>Phone Number</th>
                        <th>Manager</th>
                        <th>Manager ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(employee => (
                        <tr key={employee.id}>
                            <td>{employee.name}</td>
                            <td>{employee.email_id}</td>
                            <td>{employee.employee_id}</td>
                            <td>{employee.phone_number}</td>
                            <td>{employee.manager}</td>
                            <td>{employee.manager_id}</td>
                            <td>
                                <button onClick={() => handleEdit(employee)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPage;
