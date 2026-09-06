/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useState } from "react";
import { Download } from "lucide-react";
import CountriesPanel from "@/components/features/admin/admin-regions-page/Countriespanel";

import {
    countryService,
    ICountry,
    ICreateCountryDto,
    IUpdateCountryDto,
} from "@/services/country.service";
import {
    cityService,
    ICity,
    ICreateCityDto,
    IUpdateCityDto,
} from "@/services/city.service";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { IToastificationType, toastify } from "@/store/slices/toastificationSlice";
import { DURATION } from "@/utils/constant.utils";
import CountryDetailPanel from "@/components/features/admin/admin-regions-page/Countrydetailpanel";

export default function AdminRegionsPage() {
    // API Data & Loading States
    const [rawCountries, setRawCountries] = useState<ICountry[]>([]);
    const [rawCities, setRawCities] = useState<ICity[]>([]);
    const [isLoadingCountries, setIsLoadingCountries] = useState<boolean>(true);
    const [isLoadingCities, setIsLoadingCities] = useState<boolean>(false);

    // Filter & Selection States
    const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
    const [countryQuery, setCountryQuery] = useState("");
    const [citySearch, setCitySearch] = useState("");

    // City Pagination States
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCities, setTotalCities] = useState(0);

    const dispatch: AppDispatch = useDispatch();

    const handleAddToastification = (message: string, type: IToastificationType, duration?: number) => {
        dispatch(toastify({ message, type, duration }));
    };

    // 1. Fetch Countries from API
    const fetchCountries = useCallback(async () => {
        setIsLoadingCountries(true);
        try {
            const res = await countryService.getAllCountries({
                search: countryQuery.trim() || undefined,
            });
            setRawCountries(res.data.countries);
        } catch (err: any) {
            handleAddToastification(err.message || "Failed to load countries", "error", DURATION);
        } finally {
            setIsLoadingCountries(false);
        }
    }, [countryQuery]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchCountries();
    }, [countryQuery]);

    // 2. Fetch Cities for Selected Country with Pagination & Search using getCitiesByCountry
    const fetchCities = useCallback(async () => {
        if (!selectedCountry) {
            setRawCities([]);
            setTotalCities(0);
            setTotalPages(1);
            return;
        }

        setIsLoadingCities(true);
        try {
            const res = await cityService.getCitiesByCountry(selectedCountry._id, {
                search: citySearch.trim() || undefined,
                page,
                limit: 10,
            });

            setRawCities(res.data.cities);
            setTotalPages(res.data.pagination.totalPages);
            setTotalCities(res.data.pagination.totalItems);
        } catch (err: any) {
            handleAddToastification(err.message || "Failed to load cities", "error", DURATION);
            setRawCities([]);
            setTotalCities(0);
            setTotalPages(1);
        } finally {
            setIsLoadingCities(false);
        }
    }, [selectedCountry, citySearch, page]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchCities();
    }, [selectedCountry, citySearch, page]);

    // Select Country Handler
    const handleSelectCountry = (country: ICountry) => {
        setSelectedCountry(country);
        setPage(1);
        setCitySearch("");
    };

    // Toggle Country Active Status & Refetch
    const handleToggleEnabled = async (Id: string) => {
        const target = rawCountries.find((c) => c._id === Id);
        if (!target) return;

        const updatedStatus = !target.isActive;

        try {
            await countryService.editCountry(target._id, { isActive: updatedStatus });
            fetchCountries();
        } catch (err: any) {
            handleAddToastification(err.message || "Failed to update country status", "error", DURATION);
        }
    };

    // Create Country Handler & Refetch
    const handleSubmitCountry = async (payload: ICreateCountryDto) => {
        try {
            await countryService.createCountry(payload);
            handleAddToastification("Country created successfully", "success", DURATION);
            fetchCountries();
        } catch (err: any) {
            handleAddToastification(err.message || "Failed to create country", "error", DURATION);
        }
    };

    // Edit Country Handler & Refetch
    const handleEditCountry = async (id: string, payload: IUpdateCountryDto) => {
        try {
            await countryService.editCountry(id, payload);
            handleAddToastification("Country updated successfully", "success", DURATION);
            fetchCountries();
        } catch (err: any) {
            handleAddToastification(err.message || "Failed to update country", "error", DURATION);
        }
    };

    const handleDeleteCountry = async (id: string) => {
        try {
            await countryService.deleteCountry(id);
            handleAddToastification("Country deleted successfully", "success", DURATION);
            fetchCountries();
            setSelectedCountry(null)
        } catch (err: any) {
            handleAddToastification(err.message || "Failed to update country", "error", DURATION);
        }
    }

    // Create City Handler & Refetch
    const handleSubmitCity = async (payload: ICreateCityDto) => {
        try {
            const cityRes = await cityService.createCity(payload);
            handleAddToastification(cityRes.message || "City created successfully", "success", DURATION);
            fetchCities();
        } catch (err: any) {
            handleAddToastification(err.message || "Failed to create city", "error", DURATION);
        }
    };

    // Edit City Handler & Refetch
    const handleEditCity = async (id: string, payload: IUpdateCityDto) => {
        try {
            const cityRes = await cityService.editCity(id, payload);
            handleAddToastification(cityRes.message || "City updated successfully", "success", DURATION);
            fetchCities();
        } catch (err: any) {
            handleAddToastification(err.message || "Failed to update city", "error", DURATION);
        }
    };

    // Delete City Handler & Refetch
    const handleDeleteCity = async (id: string) => {
        try {
            const CityRes = await cityService.deleteCity(id);
            handleAddToastification(CityRes.message || "City deleted successfully", "success", DURATION);
            await fetchCities();
        } catch (err: any) {
            handleAddToastification(err.message || "Failed to delete city", "error", DURATION);
        }
    };

    return (
        <div>
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-headline-lg text-on-surface">Regions</h1>
                    <p className="text-body-md text-on-surface-variant mt-2">
                        Manage supported countries and metropolitan areas.
                    </p>
                </div>
                <button className="flex items-center gap-2 border border-outline-variant text-on-surface text-label-md rounded-md px-5 py-2.5 hover:bg-surface-container-low transition-colors">
                    <Download size={16} />
                    Export Data
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-6 mt-6 items-start">
                <CountriesPanel
                    countries={rawCountries}
                    selectedId={selectedCountry?._id}
                    query={countryQuery}
                    onQueryChange={setCountryQuery}
                    onSelect={handleSelectCountry}
                    onToggleEnabled={handleToggleEnabled}
                    onSubmitCountry={handleSubmitCountry}
                    onEditCountry={handleEditCountry}
                    onDeleteCountry={handleDeleteCountry}
                    totalCount={rawCountries.length}
                    isLoadingCountries={isLoadingCountries}

                />



                <CountryDetailPanel
                    country={selectedCountry!}
                    cities={rawCities}
                    citySearch={citySearch}
                    onCitySearchChange={(q) => {
                        setCitySearch(q);
                        // setPage(1);
                    }}
                    onAddCity={() => console.log("Add city modal trigger for country:", selectedCountry?._id)}
                    onSubmitCity={handleSubmitCity}
                    onEditCity={handleEditCity}
                    onDeleteCity={handleDeleteCity}
                    page={page}
                    totalPages={totalPages}
                    totalCities={totalCities}
                    onPageChange={setPage}
                    isLoadingCities={isLoadingCities}
                />

            </div>
        </div>
    );
}