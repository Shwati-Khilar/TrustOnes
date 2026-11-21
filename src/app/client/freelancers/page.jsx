"use client";

import { useState } from "react";

import FreelancerHero from "../../../components/client/FreelancerContents/FreelancerHero";
import FreelancerFilters from "../../../components/client/FreelancerContents/FreelancerFilters";
import FreelancerGrid from "../../../components/client/FreelancerContents/FreelancerGrid";

import { freelancers } from "../../../components/client/FreelancerContents/FreelancerData";


export default function FreelancersPage() {

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [searchTerm, setSearchTerm] = useState("");

  const filteredFreelancers = freelancers.filter(
    (freelancer) => {

      const matchesCategory =
        selectedCategory === "All" ||
        freelancer.category === selectedCategory;

      const matchesSearch =
        freelancer.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||

        freelancer.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||

        freelancer.location
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||

        freelancer.skills.some((skill) =>
          skill
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );

      return matchesCategory && matchesSearch;
    }
  );

  return (
    <>



      <section>
        <div className="p-8">

          <FreelancerHero />

          <FreelancerFilters
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            totalFreelancers={filteredFreelancers.length}
          />

          <FreelancerGrid
            freelancers={filteredFreelancers}
          />

        </div>
      </section>
    </>
  );
}