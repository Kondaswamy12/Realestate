package com.example.realestate1.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.realestate1.entity.Building;
import com.example.realestate1.entity.Guide;
import com.example.realestate1.entity.User;
import com.example.realestate1.repository.BuildingRepository;
import com.example.realestate1.repository.GuideRepository;
import com.example.realestate1.repository.UserRepository;



@RestController
@RequestMapping("/api")
public class RealEstateController {

    private final UserRepository userRepository;
    private final GuideRepository guideRepository;
    private final BuildingRepository buildingRepository;

    public RealEstateController(UserRepository userRepository,
                                GuideRepository guideRepository,
                                BuildingRepository buildingRepository) {
        this.userRepository = userRepository;
        this.guideRepository = guideRepository;
        this.buildingRepository = buildingRepository;
    }
    @GetMapping("/test")
    public String test() {
        return "test";
    }

    // ===== Users =====
 // ===== Users =====
 // Get user by username
    @GetMapping("/users/{username}")
    public User getUserByUsername(@PathVariable String username) {
        Optional<User> optionalUser = userRepository.findById(username);
        if (optionalUser.isPresent()) {
            return optionalUser.get();
        } else {
            // You can return null, or throw an exception, or return a custom message
            // Here, we throw a RuntimeException for simplicity
            throw new RuntimeException("User '" + username + "' not found!");
        }
    }


 // Update user by username (all fields except username)
 @PutMapping("/users/{username}")
 public String updateUser(@PathVariable String username, @RequestBody User updatedUser) {
     Optional<User> optionalUser = userRepository.findById(username);
     if (optionalUser.isPresent()) {
         User existingUser = optionalUser.get();

         // Update all fields except username
         existingUser.setPassword(updatedUser.getPassword());
         existingUser.setPhone(updatedUser.getPhone());
         existingUser.setEmail(updatedUser.getEmail());

         userRepository.save(existingUser);
         return "User '" + username + "' updated successfully!";
     } else {
         return "User '" + username + "' not found!";
     }
 }

 // Delete user by username
 @DeleteMapping("/users/{username}")
 public String deleteUser(@PathVariable String username) {
     if (userRepository.existsById(username)) {
         userRepository.deleteById(username);
         return "User '" + username + "' deleted successfully!";
     } else {
         return "User '" + username + "' not found!";
     }
 }

 
    @PostMapping("/users/register")
    public User registerUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PostMapping("/users/login")
    public String loginUser(@RequestBody User loginData) {
        User user = userRepository.findByUsernameAndPassword(
                loginData.getUsername(), loginData.getPassword()
        );
        return user != null ? "Login successful!" : "Invalid username or password!";
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ===== Guides =====
    @GetMapping("/guides")
    public List<Guide> getAllGuides() {
        return guideRepository.findAll();
    }

    // ===== Buildings =====
    @GetMapping("/buildings")
    public List<Building> getAllBuildings() {
        return buildingRepository.findAll();
    }
}
