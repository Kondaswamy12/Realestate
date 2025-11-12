package com.example.realestate1.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.*;

import com.example.realestate1.entity.Guide;
import com.example.realestate1.repository.GuideRepository;

@RestController
@RequestMapping("/api/guides")
public class GuideController {

    private final GuideRepository guideRepository;

    public GuideController(GuideRepository guideRepository) {
        this.guideRepository = guideRepository;
    }

    // Get all guides
    @GetMapping
    public List<Guide> getAllGuides() {
        return guideRepository.findAll();
    }

    // Delete guide by ID
    @DeleteMapping("/{id}")
    public String deleteGuide(@PathVariable Integer id) {
        if (guideRepository.existsById(id)) {
            guideRepository.deleteById(id);
            return "Guide with ID '" + id + "' deleted successfully!";
        } else {
            return "Guide with ID '" + id + "' not found!";
        }
    }
 // ===== Add a new Guide =====
    @PostMapping("/guides")
    public Guide addGuide(@RequestBody Guide guide) {
        // Simply save the new guide — JPA auto-generates guideId
        return guideRepository.save(guide);
    }

    // ===== Edit/Update an existing Guide =====
    @PutMapping("/guides/{id}")
    public String updateGuide(@PathVariable Integer id, @RequestBody Guide updatedGuide) {
        Optional<Guide> optionalGuide = guideRepository.findById(id);
        if (optionalGuide.isPresent()) {
            Guide existingGuide = optionalGuide.get();

            // Update all modifiable fields
            existingGuide.setName(updatedGuide.getName());
            existingGuide.setEmail(updatedGuide.getEmail());
            existingGuide.setPhone(updatedGuide.getPhone());
            existingGuide.setExperienceYears(updatedGuide.getExperienceYears());
            existingGuide.setRating(updatedGuide.getRating());
            existingGuide.setSpecialization(updatedGuide.getSpecialization());
            existingGuide.setCity(updatedGuide.getCity());
            existingGuide.setState(updatedGuide.getState());
            existingGuide.setAvailable(updatedGuide.getAvailable());
            existingGuide.setJoinedDate(updatedGuide.getJoinedDate());
            existingGuide.setImage(updatedGuide.getImage());

            guideRepository.save(existingGuide);
            return "Guide '" + id + "' updated successfully!";
        } else {
            return "Guide with ID '" + id + "' not found!";
        }
    }

}
