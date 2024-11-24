# Clinic Reservation System

### API Design

#### Authentication and User Management

1. **Register a new user**

    - **POST /api/users/register**
        - **Request Body:**
            ```json
            {
                "username": "johndoe",
                "password": "securePassword123",
                "email": "johndoe@example.com",
                "first_name": "John",
                "middle_name": "A.",
                "last_name": "Doe",
                "phone": "123-456-7890",
                "role": "patient" // or "doctor"
            }
            ```
        - **Response:**
            - 201 Created with user details or 400 Bad Request if validation fails.

2. **User login**
    - **POST /api/auth/login**
        - **Request Body:**
            ```json
            {
                "username": "johndoe",
                "password": "securePassword123"
            }
            ```
        - **Response:**
            - 200 OK with token or 401 Unauthorized.

#### Doctor Management (Admin Only)

3. **Create a new doctor**

    - **POST /api/doctors**
        - **Request Body:**
            ```json
            {
                "user_id": 5,
                "specialization": "Cardiology",
                "bio": "Experienced cardiologist with over 10 years of practice."
            }
            ```
        - **Response:**
            - 201 Created or 400 Bad Request.

4. **Update a doctor**

    - **PUT /api/doctors/:doctorId**
        - **Request Body:**
            ```json
            {
                "specialization": "Cardiology",
                "bio": "Updated bio information."
            }
            ```
        - **Response:**
            - 200 OK or 404 Not Found.

5. **Delete a doctor**
    - **DELETE /api/doctors/:doctorId**
        - **Response:**
            - 204 No Content or 404 Not Found.

#### Doctor Schedule Management

1. **Create a Doctor Schedule**

    - **POST /api/doctors/:doctorId/schedules**
        - **Description**: Add a new schedule entry for a doctor.
        - **Request Body:**
            ```json
            {
                "day_of_week": "Monday",
                "start_time": "09:00",
                "end_time": "17:00"
            }
            ```
        - **Response:**
            - **201 Created**: If the schedule is successfully created.
            - **400 Bad Request**: If input validation fails.
            - **404 Not Found**: If the doctor does not exist.

2. **Get Doctor Schedules**

    - **GET /api/doctors/:doctorId/schedules**
        - **Description**: Retrieve all schedule entries for a specific doctor.
        - **Response:**
            - **200 OK**: Returns a list of schedules.
            - **404 Not Found**: If the doctor does not exist.
        - **Response Body:**
            ```json
            [
                {
                    "schedule_id": 1,
                    "day_of_week": "Monday",
                    "start_time": "09:00",
                    "end_time": "17:00"
                },
                {
                    "schedule_id": 2,
                    "day_of_week": "Wednesday",
                    "start_time": "09:00",
                    "end_time": "17:00"
                }
            ]
            ```

3. **Update a Doctor Schedule**

    - **PUT /api/doctors/:doctorId/schedules/:scheduleId**
        - **Description**: Update an existing schedule entry for a doctor.
        - **Request Body:**
            ```json
            {
                "day_of_week": "Wednesday",
                "start_time": "10:00",
                "end_time": "18:00"
            }
            ```
        - **Response:**
            - **200 OK**: If the schedule is successfully updated.
            - **400 Bad Request**: If input validation fails.
            - **404 Not Found**: If the schedule or doctor does not exist.

4. **Delete a Doctor Schedule**
    - **DELETE /api/doctors/:doctorId/schedules/:scheduleId**
        - **Description**: Remove a schedule entry for a doctor.
        - **Response:**
            - **204 No Content**: If the schedule is successfully deleted.
            - **404 Not Found**: If the schedule or doctor does not exist.

#### Appointment Management

6. **Search and list doctors**

    - **GET /api/doctors**
        - **Query Parameters:** Optional filters like specialization.
        - **Response:**
            - 200 OK with a list of doctors.

7. **View a doctor's availability**

    - **GET /api/doctors/:doctorId/availability**
        - **Response:**
            - 200 OK with available time slots.

8. **Create a new appointment**

    - **POST /api/appointments**
        - **Request Body:**
            ```json
            {
                "patient_id": 123,
                "doctor_id": 456,
                "appointment_date": "2024-11-25",
                "start_time": "10:00",
                "end_time": "10:30"
            }
            ```
        - **Response:**
            - 201 Created or 400 Bad Request.

9. **Approve or modify an appointment**

    - **PUT /api/appointments/:appointmentId**
        - **Request Body:**
            ```json
            {
                "status": "approved"
            }
            ```
        - **Response:**
            - 200 OK or 404 Not Found.

10. **Cancel an appointment**
    - **DELETE /api/appointments/:appointmentId**
        - **Response:**
            - 204 No Content or 404 Not Found.

#### Notification Management

11. **Send a notification**
    -   **POST /api/notifications**
        -   **Request Body:**
            ```json
            {
                "user_id": 123,
                "message": "Your appointment has been confirmed."
            }
            ```
        -   **Response:**
            -   201 Created or 400 Bad Request.

### Additional Considerations

-   **Security**: Implement token-based authentication (JWT) for securing endpoints. Ensure role-based access control (RBAC) to restrict actions based on user roles (e.g., admin, doctor, patient).

-   **Validation**: Validate all inputs rigorously using middleware or libraries (e.g., express-validator).

-   **Error Handling**: Provide meaningful error messages and HTTP status codes for all API responses.

-   **Background Jobs**: Implement a scheduled task to update doctor availability for the coming 7 days, considering their schedules and holidays.
