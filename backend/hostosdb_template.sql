create table Customers (
    ID int primary key auto_increment,
    FirstName varchar(50) not null,
    LastName varchar(50) not null,
    Email varchar(100) unique not null,
    PhoneNumber varchar(15),
    PasswordHash varchar(255) not null,
    CreatedAt datetime default current_timestamp
);

create table Roles (
    ID int primary key auto_increment,
    RoleName varchar(50) unique not null,
    Description varchar(255)
);

create table Staff (
    ID int primary key auto_increment,
    FirstName varchar(50) not null,
    LastName varchar(50) not null,
    Email varchar(100) unique not null,
    PasswordHash varchar(255) not null,
    RoleID int not null,
    CreatedAt datetime default current_timestamp,
    Foreign key (RoleID) references Roles(ID)
);

create table Products (
    ID int primary key auto_increment,
    ProductName varchar(100) not null,
    Description text,
    Price decimal(10, 2) not null,
    StockQuantity int not null,
    CreatedAt datetime default current_timestamp
);

create table Orders (
    ID int primary key auto_increment,
    CustomerID int not null,
    OrderDate datetime default current_timestamp,
    ProductID int not null,
    Status ENUM("Pending", "Processing", "Delivered", "Finished") not null,
    TotalAmount decimal(10, 2) not null,
    Foreign key (CustomerID) references Customers(ID) ON DELETE CASCADE,
    Foreign key (ProductID) references Products(ID) ON DELETE CASCADE
);

create table ActualOrders (
    ID int primary key auto_increment,
    CustomerID int not null,
    ProductID int not null,
    OrderDate datetime default current_timestamp,
    Status ENUM("Pending", "Processing", "Delivered", "Suspended", "Finished") not null,
    RecurentPrice decimal(10, 2) not null,
    StartedAt datetime default current_timestamp,
    EndedAt datetime not null,
    Foreign key (CustomerID) references Customers(ID) ON DELETE CASCADE,
    Foreign key (ProductID) references Products(ID) ON DELETE CASCADE
)

Insert into Roles (RoleName, Description) values
("Admin", "Administrator with full access"),
("Support", "Customer support staff"),
("Manager", "Store manager with limited access");


