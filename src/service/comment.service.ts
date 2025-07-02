import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Comment } from '../model/comment.model';

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    private apiUrl = './data/data.json';

    constructor(private http: HttpClient) {}

    getComments(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    getComment(id: number): Observable<Comment> {
        return this.http.get<Comment>(`${this.apiUrl}/${id}`);
    }

    addComment(comment: Omit<Comment, 'id' | 'createdAt'>): Observable<Comment> {
        return this.http.post<Comment>(this.apiUrl, comment);
    }

    updateComment(id: number, comment: Partial<Comment>): Observable<Comment> {
        return this.http.put<Comment>(`${this.apiUrl}/${id}`, comment);
    }

    deleteComment(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}