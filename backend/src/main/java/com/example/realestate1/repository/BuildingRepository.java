package com.example.realestate1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.realestate1.entity.Building;


@Repository
public interface BuildingRepository extends JpaRepository<Building, Integer> {
   
}