package com.example.realestate1.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.realestate1.entity.Building;
import com.example.realestate1.entity.User;


@Repository
public interface BuildingRepository extends JpaRepository<Building, Integer> {


	void deleteById(Integer id);


	boolean existsById(Integer id);

   
}