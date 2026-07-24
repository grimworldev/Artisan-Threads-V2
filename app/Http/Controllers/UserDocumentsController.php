<?php

namespace App\Http\Controllers;

use App\Models\UserDocuments;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserDocumentsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $isPassport = $request->input('document_type') === 'philippine_passport';

        $validated = $request->validate([
            'document_type' => 'required|string|in:philippine_passport,philsys_national_id,drivers_license,umid,prc_id,postal_id,voters_id,tin_id,philhealth_id',
            'file' => 'required|file|mimes:jpg,jpeg,png|max:5120',
            'file_2' => [$isPassport ? 'prohibited' : 'required', 'file', 'mimes:jpg,jpeg,png', 'max:5120'],
        ]);

        $path = $request->file('file')->store('verification-documents', 'public');
        $path2 = $isPassport ? null : $request->file('file_2')->store('verification-documents', 'public');

        $request->user()->documents()->create([
            'document_type' => $validated['document_type'],
            'file_path' => $path,
            'original_filename' => $request->file('file')->getClientOriginalName(),
            'file_path_2' => $path2,
            'original_filename_2' => $isPassport ? null : $request->file('file_2')->getClientOriginalName(),
        ]);

        return redirect()
            ->route('profiles.show', Auth::user()->username)
            ->with('success', 'Business registered successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(UserDocuments $userDocuments)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UserDocuments $userDocuments)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, UserDocuments $userDocuments)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserDocuments $userDocuments)
    {
        //
    }
}
