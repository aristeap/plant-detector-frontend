CREATE TABLE users(
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    user_role VARCHAR(50) DEFAULT 'simple',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE plants(
    plant_id INT PRIMARY KEY AUTO_INCREMENT,
    scientific_name VARCHAR(255) UNIQUE,
    common_names JSON,
    genus VARCHAR(255),
    watering TEXT,
    sunlight TEXT,
    pruning TEXT

);

CREATE TABLE user_queries(
    query_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    plant_id INT,
    uploaded_image_url VARCHAR(255),
    confidence_score DECIMAL,
    front_end_response JSON,
    queried_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (plant_id) REFERENCES plants(plant_id)

);


CREATE TABLE user_comments(
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    plant_id INT,
    comment_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY(plant_id) REFERENCES plants(plant_id)
);

CREATE TABLE plants_extra_images(
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    plant_id INT,
    image_url VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (plant_id) REFERENCES plants(plant_id)
);

CREATE TABLE articles(
    article_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    plant_id INT,
    title TEXT,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (plant_id) REFERENCES plants(plant_id)
);

