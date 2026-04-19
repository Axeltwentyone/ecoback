<?php

namespace App\Http\Requests\espace;

use Illuminate\Foundation\Http\FormRequest;

class StoreEspaceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
    
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nom'        => 'required|string|max:255',
            'surface'    => 'required|integer|min:1',
            'type'       => 'required|string|max:100',
            'tarif_jour' => 'required|integer|min:0',
            'photo'      => 'nullable|string',
        ];
    }
}
