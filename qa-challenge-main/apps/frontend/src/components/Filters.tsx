import React, { useEffect, useRef, useState } from "react";

import { RoomingListStatus } from "../types";
import { path } from "../../../../node_modules/app-root-path/index.d";
import styled from "styled-components";
import { useRoomingListStore } from "../store/roomingListStore";

interface ToggleOptionProps {
  onClick: () => void;
}

interface CheckboxProps {
  isSelected: boolean;
}

// Styled components
const FilterContainer = styled.div`
  position: relative;
`;

const FilterButton = styled.button`
  height: 3rem;
  padding: 0.625rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  background-color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f8fafc;
  }
`;

const IconContainer = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FilterIcon = styled.svg`
  width: 1.25rem;
  height: 1.25rem;
  color: #94a3b8;
`;

const ButtonText = styled.span`
  font-family: "Poppins", sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  color: #64748b;
`;

const FilterPopup = styled.div`
  position: absolute;
  right: 1;
  top: 3.5rem;
  z-index: 10;
  padding: 0.75rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 1rem;
  min-width: 240px;
`;

const FilterContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;
`;

const FilterSection = styled.div`
  width: 10rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0.5rem;
`;

const SectionHeader = styled.div`
  width: 10rem;
  height: 1rem;
  color: #64748b;
  font-family: "Poppins", sans-serif;
  font-size: 0.75rem;
  font-weight: 400;
  text-transform: uppercase;
  line-height: 1;
`;

const FilterOptions = styled.div`
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0.75rem;
`;

const ToggleOption = styled.div<ToggleOptionProps>`
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const Checkbox = styled.div<CheckboxProps>`
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
  background-color: ${(props) => (props.isSelected ? "#14b8a6" : "white")};
  border: ${(props) => (props.isSelected ? "none" : "1px solid #e2e8f0")};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OptionLabel = styled.div`
  color: #171717;
  font-family: "Poppins", sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1;
`;

const SaveButton = styled.button`
  align-self: stretch;
  padding: 0.5rem 1.25rem;
  background-color: #4f46e5;
  border-radius: 0.375rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4338ca;
  }
`;

const SaveButtonText = styled.div`
  text-align: center;
  color: white;
  font-family: "Poppins", sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1;
`;

const CheckIcon = styled.svg`
  width: 0.75rem;
  height: 0.75rem;
  color: white;
`;

export const Filters = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { setStatus } = useRoomingListStore();

  const [selectedStatuses, setSelectedStatuses] = useState({
    [RoomingListStatus.ACTIVE]: false,
    [RoomingListStatus.CLOSED]: true,
    [RoomingListStatus.CANCELLED]: false,
  });

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleFilter = (status: RoomingListStatus) => {
    setSelectedStatuses((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const applyFilters = () => {
    // Get the active statuses
    const activeStatuses = Object.entries(selectedStatuses)
      .filter(([_, isSelected]) => isSelected)
      .map(([status]) => status);

    // Apply only the first selected status (or null if none)
    setStatus(activeStatuses.length > 0 ? activeStatuses[0] : null);
    setIsOpen(false);
  };

  return (
    <FilterContainer>
      <FilterButton ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        <ButtonText>Filters</ButtonText>
        <IconContainer>
          <img src="../../assets/Group.svg" alt="Filters" />
        </IconContainer>
      </FilterButton>

      {/* Filter Popup */}
      {isOpen && (
        <FilterPopup ref={popupRef}>
          <FilterContent>
            <FilterSection>
              <SectionHeader>RFP status</SectionHeader>
              <FilterOptions>
                {/* Active Status */}
                <ToggleOption
                  onClick={() => toggleFilter(RoomingListStatus.ACTIVE)}
                >
                  <Checkbox data-testid="active-checkbox"
                    isSelected={selectedStatuses[RoomingListStatus.ACTIVE]}
                  >
                    {selectedStatuses[RoomingListStatus.ACTIVE] && (
                      <CheckIcon
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </CheckIcon>
                    )}
                  </Checkbox>
                  <OptionLabel>{RoomingListStatus.ACTIVE}</OptionLabel>
                </ToggleOption>

                {/* Closed Status */}
                <ToggleOption
                  onClick={() => toggleFilter(RoomingListStatus.CLOSED)}
                >
                  <Checkbox data-testid="closed-checkbox"
                    isSelected={selectedStatuses[RoomingListStatus.CLOSED]}
                  >
                    {selectedStatuses[RoomingListStatus.CLOSED] && (
                      <CheckIcon
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </CheckIcon>
                    )}
                  </Checkbox>
                  <OptionLabel>{RoomingListStatus.CLOSED}</OptionLabel>
                </ToggleOption>

                {/* Cancelled Status */}
                <ToggleOption
                  onClick={() => toggleFilter(RoomingListStatus.CANCELLED)}
                >
                  <Checkbox data-testid="cancelled-checkbox"
                    isSelected={selectedStatuses[RoomingListStatus.CANCELLED]}
                  >
                    {selectedStatuses[RoomingListStatus.CANCELLED] && (
                      <CheckIcon
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </CheckIcon>
                    )}
                  </Checkbox>
                  <OptionLabel>{RoomingListStatus.CANCELLED}</OptionLabel>
                </ToggleOption>
              </FilterOptions>
            </FilterSection>
          </FilterContent>

          {/* Save Button */}
          <SaveButton onClick={applyFilters}>
            <SaveButtonText>Save</SaveButtonText>
          </SaveButton>
        </FilterPopup>
      )}
    </FilterContainer>
  );
};
