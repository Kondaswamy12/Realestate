package com.example.realestate1.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.*;

import com.example.realestate1.entity.User;
import com.example.realestate1.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Register new user
    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    // Login user
    @PostMapping("/login")
    public String loginUser(@RequestBody User loginData) {
        User user = userRepository.findByUsernameAndPassword(
                loginData.getUsername(), loginData.getPassword()
        );
        return user != null ? "Login successful!" : "Invalid username or password!";
    }

    // Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by username
    @GetMapping("/{username}")
    public User getUserByUsername(@PathVariable String username) {
        Optional<User> optionalUser = userRepository.findById(username);
        return optionalUser.orElseThrow(() -> new RuntimeException("User '" + username + "' not found!"));
    }

    // Update user (except username)
    @PutMapping("/{username}")
    public String updateUser(@PathVariable String username, @RequestBody User updatedUser) {
        Optional<User> optionalUser = userRepository.findById(username);
        if (optionalUser.isPresent()) {
            User existingUser = optionalUser.get();
            existingUser.setPassword(updatedUser.getPassword());
            existingUser.setPhone(updatedUser.getPhone());
            existingUser.setEmail(updatedUser.getEmail());
            userRepository.save(existingUser);
            return "User '" + username + "' updated successfully!";
        } else {
            return "User '" + username + "' not found!";
        }
    }

    // Delete user
    @DeleteMapping("/{username}")
    public String deleteUser(@PathVariable String username) {
        if (userRepository.existsById(username)) {
            userRepository.deleteById(username);
            return "User '" + username + "' deleted successfully!";
        } else {
            return "User '" + username + "' not found!";
        }
    }
}
