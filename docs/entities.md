## User

- fullname: string
- email: string
- password: string
- image: google image
- is_active: boolean default 1, for manually deactivating an user set 1
- is_verified: boolean default 0, after email verification 1
- role: enum = [
  "client",
  "admin",
  "logistics-lead",
  "logistics-member",
  "warehouse",
  "clinical",
  "ai",
  ],
- otp: email verification otp
- otpExpireTime: email otp expire time

## Product

- name: string
- quantity: number
- price: number
- is_active: boolean, default false
