import { Listing, ListingType, MaterialType, VerificationStatus, Manifest } from './types';

export const MOCK_LISTINGS: Listing[] = [
  {
    id: 'l1',
    userId: 'u2',
    companyName: 'Alpha Textiles',
    type: ListingType.OFFER,
    material: MaterialType.TEXTILE,
    quantity: 500,
    unit: 'kg',
    pricePerUnit: 20,
    location: 'Panipat, Haryana',
    description: 'Cotton scraps from denim production.',
    datePosted: '2023-10-25',
    imageUrl: 'https://images.unsplash.com/photo-1605218427368-35b019b8a377?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'l2',
    userId: 'u3',
    companyName: 'EcoPack Solutions',
    type: ListingType.REQUEST,
    material: MaterialType.PLASTIC,
    quantity: 2,
    unit: 'tons',
    pricePerUnit: 45,
    location: 'Gurugram, Haryana',
    description: 'Need LDPE plastic for recycling plant.',
    datePosted: '2023-10-26',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'l3',
    userId: 'u4',
    companyName: 'Green Earth Compost',
    type: ListingType.REQUEST,
    material: MaterialType.ORGANIC,
    quantity: 1000,
    unit: 'kg',
    pricePerUnit: 5,
    location: 'Noida, UP',
    description: 'Looking for vegetable market waste.',
    datePosted: '2023-10-27',
    imageUrl: 'https://images.unsplash.com/photo-1536536982624-06c1776e0ca8?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'l4',
    userId: 'u5',
    companyName: 'MetalWorks Ind',
    type: ListingType.OFFER,
    material: MaterialType.METAL,
    quantity: 300,
    unit: 'kg',
    pricePerUnit: 150,
    location: 'Manesar, Haryana',
    description: 'Aluminum shavings from lathe operations.',
    datePosted: '2023-10-28',
    imageUrl: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=600'
  }
];

export const MOCK_MANIFESTS: Manifest[] = [
  {
    id: 'm-1023',
    date: '2023-10-15',
    material: 'Plastic Scraps',
    quantity: '200 kg',
    source: 'My Company',
    destination: 'RecyclePro Inc',
    status: 'Verified',
    carbonSaved: 150
  },
  {
    id: 'm-1024',
    date: '2023-10-20',
    material: 'Cardboard Waste',
    quantity: '500 kg',
    source: 'My Company',
    destination: 'Paper Mill Ltd',
    status: 'Completed',
    carbonSaved: 80
  },
  {
    id: 'm-1029',
    date: '2023-10-29',
    material: 'Organic Sludge',
    quantity: '1 ton',
    source: 'FoodCo',
    destination: 'My Company',
    status: 'In Transit',
    carbonSaved: 0
  }
];