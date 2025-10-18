package com.example.realestate1.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.realestate1.entity.User;


public interface UserRepository extends JpaRepository<User, String> {
    User findByUsernameAndPassword(String username, String password);
}
