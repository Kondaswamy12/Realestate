package com.example.realestate1.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.*;

import com.example.realestate1.entity.Building;
import com.example.realestate1.repository.BuildingRepository;

@RestController
@RequestMapping("/api/buildings")
@CrossOrigin(origins = "http://localhost:3000") // ✅ Allow frontend access
public class BuildingController {

    private final BuildingRepository buildingRepository;

    public BuildingController(BuildingRepository buildingRepository) {
        this.buildingRepository = buildingRepository;
    }

    // ===== Get all buildings =====
    @GetMapping
    public List<Building> getAllBuildings() {
        return buildingRepository.findAll();
    }

    // ===== Add new building =====
    @PostMapping
    public Building addBuilding(@RequestBody Building building) {
        // ✅ Debug print (optional)
        System.out.println("Received new building: " + building.getName());

        // Ensure non-null numeric fields
        if (building.getPrice() == null) building.setPrice(0.0);
        if (building.getBedrooms() == null) building.setBedrooms(0);
        if (building.getBathrooms() == null) building.setBathrooms(0);
        if (building.getAreaSqft() == null) building.setAreaSqft(0);
        if (building.getFeatured() == null) building.setFeatured(false);

        return buildingRepository.save(building);
    }

    // ===== Delete building =====
    @DeleteMapping("/{id}")
    public String deleteBuilding(@PathVariable Integer id) {
        if (buildingRepository.existsById(id)) {
            buildingRepository.deleteById(id);
            return "Building with ID '" + id + "' deleted successfully!";
        } else {
            return "Building with ID '" + id + "' not found!";
        }
    }

    // ===== Edit / Update Building =====
    @PutMapping("/{id}") // ✅ matches frontend PUT URL
    public String updateBuilding(@PathVariable Integer id, @RequestBody Building updatedBuilding) {
        Optional<Building> optionalBuilding = buildingRepository.findById(id);
        if (optionalBuilding.isPresent()) {
            Building existingBuilding = optionalBuilding.get();

            existingBuilding.setGuideId(updatedBuilding.getGuideId());
            existingBuilding.setName(updatedBuilding.getName());
            existingBuilding.setAddress(updatedBuilding.getAddress());
            existingBuilding.setCity(updatedBuilding.getCity());
            existingBuilding.setState(updatedBuilding.getState());
            existingBuilding.setZipCode(updatedBuilding.getZipCode());
            existingBuilding.setPrice(updatedBuilding.getPrice());
            existingBuilding.setType(updatedBuilding.getType());
            existingBuilding.setBedrooms(updatedBuilding.getBedrooms());
            existingBuilding.setBathrooms(updatedBuilding.getBathrooms());
            existingBuilding.setAreaSqft(updatedBuilding.getAreaSqft());
            existingBuilding.setAvailability(updatedBuilding.getAvailability());
            existingBuilding.setImage(updatedBuilding.getImage());
            existingBuilding.setFeatured(updatedBuilding.getFeatured());

            buildingRepository.save(existingBuilding);
            return "Building '" + id + "' updated successfully!";
        } else {
            return "Building with ID '" + id + "' not found!";
        }
    }

    // ===== Handle invalid data (optional) =====
    @ExceptionHandler(Exception.class)
    @ResponseStatus(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
    public String handleError(Exception ex) {
        ex.printStackTrace();
        return "Error: " + ex.getMessage();
    }
}
